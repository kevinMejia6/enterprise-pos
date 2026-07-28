<template>
  <div
    class="history-shell"
    :class="{ 'history-shell--collapsed': sidebarCollapsed }"
  >
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @close-mobile="mobileSidebarOpen = false"
    />

    <div
      v-if="mobileSidebarOpen"
      class="sidebar-overlay"
      @click="mobileSidebarOpen = false"
    />

    <main class="history-main">
      <div class="history-page">
        <header class="history-header">
          <div class="history-header__identity">
            <v-btn
              icon
              dark
              class="mobile-menu-btn mr-2"
              @click="mobileSidebarOpen = true"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>

            <div class="history-header__icon">
              <v-icon color="white" size="30">
                mdi-receipt-text-clock-outline
              </v-icon>
            </div>

            <div>
              <div class="history-header__eyebrow">ENTERPRISE POS</div>

              <h1 class="history-header__title">Historial de ventas</h1>

              <p class="history-header__description">
                Consulta, filtra y revisa las ventas registradas.
              </p>
            </div>
          </div>

          <v-btn
            color="white"
            depressed
            large
            class="return-pos-button"
            @click="$router.push('/pos')"
          >
            <v-icon left color="primary"> mdi-cart-outline </v-icon>

            Volver al POS
          </v-btn>
        </header>

        <section class="history-summary">
          <article class="history-summary__card">
            <div class="history-summary__icon history-summary__icon--blue">
              <v-icon color="primary"> mdi-receipt-text-outline </v-icon>
            </div>

            <div>
              <span>Ventas encontradas</span>
              <strong>{{ summary.totalSales }}</strong>
            </div>
          </article>

          <article class="history-summary__card">
            <div class="history-summary__icon history-summary__icon--green">
              <v-icon color="success"> mdi-cash-multiple </v-icon>
            </div>

            <div>
              <span>Total filtrado</span>
              <strong>{{ formatCurrency(summary.totalAmount) }}</strong>
            </div>
          </article>

          <article class="history-summary__card">
            <div class="history-summary__icon history-summary__icon--orange">
              <v-icon color="orange"> mdi-package-variant </v-icon>
            </div>

            <div>
              <span>Unidades filtradas</span>
              <strong>{{ summary.totalUnits }}</strong>
            </div>
          </article>
        </section>

        <section class="history-panel">
          <div class="history-panel__header">
            <div>
              <h2>Ventas realizadas</h2>
              <p>Busca por número de venta o filtra por fecha y estado.</p>
            </div>

            <v-btn
              outlined
              color="primary"
              class="refresh-button"
              :loading="loading"
              @click="loadSales"
            >
              <v-icon left>mdi-refresh</v-icon>
              Actualizar
            </v-btn>
          </div>

          <div class="filters-panel">
            <div class="filter-field filter-field--search">
              <label>Buscar venta</label>

              <div class="filter-input">
                <v-icon size="20">mdi-magnify</v-icon>

                <input
                  v-model.trim="filters.search"
                  class="search-input"
                  placeholder="Ej. V-20260728..."
                  @input="onSearchInput"
                />
                <button
                  v-if="filters.search"
                  type="button"
                  class="filter-input__clear"
                  @click="filters.search = ''"
                >
                  <v-icon size="17">mdi-close</v-icon>
                </button>
              </div>
            </div>

            <div class="filter-field">
              <label>Desde</label>
              <input
                class="date-input"
                type="date"
                v-model="filters.dateFrom"
                @change="loadSales"
              />
            </div>

            <div class="filter-field">
              <label>Hasta</label>
              <input
                type="date"
                class="date-input"
                v-model="filters.dateTo"
                @change="loadSales"
              />
            </div>

            <div class="filter-field">
              <label>Estado</label>

              <select
                v-model="filters.status"
                class="select-input"
                @change="loadSales"
              >
                <option value="">Todos</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div class="filter-actions">
              <v-btn
                text
                color="secondary"
                class="clear-button"
                :disabled="!hasActiveFilters || loading"
                @click="clearFilters"
              >
                Limpiar
              </v-btn>
            </div>
          </div>

          <div class="table-toolbar">
            <div class="results-information">
              <strong>{{ pagination.totalItems }}</strong>
              resultado(s) encontrado(s)
            </div>

            <label class="limit-selector">
              <span>Mostrar</span>

              <select
                v-model.number="pagination.itemsPerPage"
                @change="changeLimit"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>

              <span>registros</span>
            </label>
          </div>

          <v-skeleton-loader v-if="loading" type="table" />

          <div v-else-if="sales.length === 0" class="history-empty">
            <div class="history-empty__icon">
              <v-icon color="primary" size="58">
                mdi-receipt-text-search-outline
              </v-icon>
            </div>

            <h3>No se encontraron ventas</h3>

            <p>Cambia los filtros o registra una venta desde el POS.</p>

            <v-btn
              v-if="hasActiveFilters"
              outlined
              color="primary"
              @click="clearFilters"
            >
              Limpiar filtros
            </v-btn>
          </div>

          <div v-else class="history-table-wrapper">
            <table class="history-table">
              <thead>
                <tr>
                  <th>Número de venta</th>
                  <th>Fecha</th>
                  <th>Unidades</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="sale in sales" :key="sale.id">
                  <td>
                    <div class="sale-number">
                      <div class="sale-number__icon">
                        <v-icon color="primary" size="19">
                          mdi-receipt-text-outline
                        </v-icon>
                      </div>

                      <strong>{{ sale.saleNumber }}</strong>
                    </div>
                  </td>

                  <td>{{ formatDate(sale.createdAt) }}</td>

                  <td>
                    <span class="units-badge">
                      {{ sale.totalItems }}
                    </span>
                  </td>

                  <td class="sale-total">
                    {{ formatCurrency(sale.total) }}
                  </td>

                  <td>
                    <v-chip
                      small
                      :color="sale.status === 'COMPLETED' ? 'success' : 'error'"
                      text-color="white"
                    >
                      {{ translateStatus(sale.status) }}
                    </v-chip>
                  </td>

                  <td class="text-right">
                    <v-btn
                      outlined
                      small
                      color="primary"
                      class="detail-button"
                      @click="openSaleDetail(sale.id)"
                    >
                      <v-icon left small> mdi-eye-outline </v-icon>

                      Ver detalle
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="pagination.totalPages > 1" class="history-pagination">
            <div class="pagination-copy">
              Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
            </div>

            <v-pagination
              v-model="pagination.currentPage"
              :length="pagination.totalPages"
              :total-visible="6"
              color="primary"
              @input="loadSales"
            />
          </div>
        </section>
      </div>
    </main>

    <SaleDetailDialog
      v-model="detailDialog"
      :sale="selectedSale"
      :loading="loadingDetail"
      @close="closeSaleDetail"
    />

    <AppSnackbar
      v-model="snackbar.visible"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </div>
</template>

<script>
import AppSidebar from "@/components/layout/AppSidebar.vue";
import SaleDetailDialog from "@/components/sales/SaleDetailDialog.vue";
import AppSnackbar from "@/components/common/AppSnackbar.vue";
import saleService from "@/services/sale.service";

export default {
  name: "SalesHistoryView",

  components: {
    AppSidebar,
    SaleDetailDialog,
    AppSnackbar,
  },

  data() {
    return {
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      sales: [],
      loading: false,
      loadingDetail: false,

      detailDialog: false,
      selectedSale: null,
      searchTimeout: null,

      filters: {
        search: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      },

      summary: {
        totalSales: 0,
        totalAmount: 0,
        totalUnits: 0,
      },

      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
      },

      snackbar: {
        visible: false,
        message: "",
        color: "success",
      },
    };
  },

  computed: {
    hasActiveFilters() {
      return Boolean(
        this.filters.search ||
          this.filters.status ||
          this.filters.dateFrom ||
          this.filters.dateTo,
      );
    },
  },

  created() {
    this.loadSales();
  },

  methods: {
    async loadSales() {
      if (
        this.filters.dateFrom &&
        this.filters.dateTo &&
        this.filters.dateFrom > this.filters.dateTo
      ) {
        this.showSnackbar(
          "La fecha inicial no puede ser mayor que la fecha final",
          "warning",
        );

        return;
      }

      this.loading = true;

      try {
        const response = await saleService.getSales({
          page: this.pagination.currentPage,
          limit: this.pagination.itemsPerPage,
          ...this.filters,
        });

        this.sales = response.sales || [];

        this.summary = {
          ...this.summary,
          ...(response.summary || {}),
        };

        if (response.pagination) {
          this.pagination = {
            ...this.pagination,
            ...response.pagination,
          };
        }
      } catch (error) {
        this.sales = [];

        this.showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "No fue posible cargar las ventas",
          "error",
        );
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      this.pagination.currentPage = 1;
      this.loadSales();
    },

    clearFilters() {
      this.filters = {
        search: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      };

      this.pagination.currentPage = 1;
      this.loadSales();
    },

    changeLimit() {
      this.pagination.currentPage = 1;
      this.loadSales();
    },

    async openSaleDetail(id) {
      this.detailDialog = true;
      this.loadingDetail = true;
      this.selectedSale = null;

      try {
        this.selectedSale = await saleService.getSaleById(id);
      } catch (error) {
        this.detailDialog = false;

        this.showSnackbar(
          error.response?.data?.message ||
            error.message ||
            "No fue posible cargar el detalle",
          "error",
        );
      } finally {
        this.loadingDetail = false;
      }
    },

    closeSaleDetail() {
      this.detailDialog = false;
      this.selectedSale = null;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value || 0));
    },

    formatDate(value) {
      if (!value) {
        return "Sin fecha";
      }

      return new Intl.DateTimeFormat("es-SV", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    },

    translateStatus(status) {
      return status === "COMPLETED" ? "Completada" : "Cancelada";
    },

    showSnackbar(message, color = "success") {
      this.snackbar = {
        visible: false,
        message,
        color,
      };

      this.$nextTick(() => {
        this.snackbar.visible = true;
      });
    },

    onSearchInput() {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        this.pagination.currentPage = 1;

        this.loadSales();
      }, 300);
    },
  },
};
</script>

<style scoped lang="scss">
.history-shell {
  min-height: 100vh;
  background: #f4f7fc;
}

.history-main {
  width: calc(100% - 220px);
  margin-left: 220px;
  transition: width 0.25s ease, margin-left 0.25s ease;
}

.history-shell--collapsed {
  .history-main {
    width: calc(100% - 72px);
    margin-left: 72px;
  }
}

.history-page {
  min-height: 100vh;
  padding: 0 20px 30px;
  background: #f4f7fc;
}

.history-header {
  min-height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 24px 28px;
  border-radius: 0 0 24px 24px;
  color: white;
  background: radial-gradient(
      circle at 75% 10%,
      rgba(255, 255, 255, 0.12),
      transparent 28%
    ),
    linear-gradient(115deg, #0d348e, #104ec7 58%, #2563eb);
  box-shadow: 0 14px 35px rgba(26, 76, 181, 0.2);
}

.history-header__identity {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  display: none;
}

.history-header__icon {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
}

.history-header__eyebrow {
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.8;
}

.history-header__title {
  margin: 4px 0;
  font-size: 1.75rem;
  font-weight: 900;
}

.history-header__description {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.82;
}

.return-pos-button {
  border-radius: 11px;
  color: #174bb9 !important;
  text-transform: none;
  font-weight: 800;
}

.history-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
  margin: 20px 0;
}

.history-summary__card {
  min-height: 96px;
  display: flex;
  align-items: center;
  padding: 17px;
  border: 1px solid #e5ebf4;
  border-radius: 17px;
  background: white;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);
}

.history-summary__icon {
  width: 52px;
  height: 52px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  border-radius: 14px;

  &--blue {
    background: #eaf2ff;
  }

  &--green {
    background: #eaf9ef;
  }

  &--orange {
    background: #fff2e5;
  }
}

.history-summary__card span {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 700;
}

.history-summary__card strong {
  display: block;
  margin-top: 5px;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 900;
}

.history-panel {
  min-height: 570px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  background: white;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.history-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.history-panel__header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.06rem;
  font-weight: 900;
}

.history-panel__header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.refresh-button,
.detail-button,
.apply-button,
.clear-button {
  border-radius: 10px;
  text-transform: none;
  font-weight: 800;
}

.filters-panel {
  display: grid;
  grid-template-columns:
    minmax(240px, 1.5fr)
    minmax(145px, 0.7fr)
    minmax(145px, 0.7fr)
    minmax(155px, 0.75fr)
    auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e5ebf4;
  border-radius: 14px;
  background: #f8fafc;
}

.filter-field {
  min-width: 0;
}

.filter-field label {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 0.66rem;
  font-weight: 800;
}

.filter-input {
  position: relative;
  height: 43px;
  display: flex;
  align-items: center;
  padding: 0 38px 0 12px;
  border: 1px solid #dce5f1;
  border-radius: 10px;
  background: white;
}

.filter-input .v-icon {
  color: #94a3b8;
}

.filter-input input {
  min-width: 0;
  flex: 1;
  margin-left: 8px;
  border: none;
  outline: none;
  color: #0f172a;
  background: transparent;
  font-size: 0.76rem;
}

.filter-input__clear {
  position: absolute;
  right: 8px;
  border: none;
  color: #94a3b8;
  background: transparent;
  cursor: pointer;
}

.date-input,
.select-input {
  width: 100%;
  height: 43px;
  padding: 0 11px;
  border: 1px solid #dce5f1;
  border-radius: 10px;
  outline: none;
  color: #0f172a;
  background: white;
  font-size: 0.74rem;
}

.filter-input:focus-within,
.date-input:focus,
.select-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.apply-button {
  min-width: 105px;
}

.clear-button {
  min-width: 72px;
}

.table-toolbar {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.results-information {
  color: #64748b;
  font-size: 0.72rem;
}

.results-information strong {
  color: #0f172a;
}

.limit-selector {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #64748b;
  font-size: 0.7rem;
}

.limit-selector select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dce5f1;
  border-radius: 8px;
  outline: none;
  background: white;
}

.history-table-wrapper {
  overflow-x: auto;
  border: 1px solid #edf2f7;
  border-radius: 12px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  padding: 13px 15px;
  color: #64748b;
  background: #f8fafc;
  font-size: 0.69rem;
  font-weight: 800;
  text-align: left;
}

.history-table td {
  padding: 14px 15px;
  border-bottom: 1px solid #edf2f7;
  color: #475569;
  font-size: 0.75rem;
}

.history-table tbody tr {
  transition: background 0.18s ease;
}

.history-table tbody tr:hover {
  background: #fbfdff;
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.sale-number {
  display: flex;
  align-items: center;
}

.sale-number__icon {
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 10px;
  background: #eef5ff;
}

.sale-number strong {
  color: #0f172a;
  font-size: 0.75rem;
}

.units-badge {
  min-width: 36px;
  display: inline-flex;
  justify-content: center;
  padding: 5px 9px;
  border-radius: 8px;
  color: #1856d8;
  background: #eef5ff;
  font-weight: 900;
}

.sale-total {
  color: #1856d8 !important;
  font-weight: 900;
}

.history-empty {
  min-height: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.history-empty__icon {
  width: 112px;
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  background: #edf3ff;
}

.history-empty h3 {
  margin: 18px 0 0;
  color: #0f172a;
}

.history-empty p {
  margin: 7px 0 18px;
  color: #64748b;
  font-size: 0.8rem;
}

.history-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination-copy {
  color: #64748b;
  font-size: 0.7rem;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 1250px) {
  .filters-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-field--search,
  .filter-actions {
    grid-column: span 2;
  }

  .filter-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 960px) {
  .history-main,
  .history-shell--collapsed .history-main {
    width: 100%;
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 19;
    display: block;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
  }
}

@media (max-width: 850px) {
  .history-summary {
    grid-template-columns: 1fr;
  }

  .return-pos-button {
    display: none;
  }
}

@media (max-width: 650px) {
  .history-page {
    padding: 0 10px 20px;
  }

  .history-header {
    padding: 20px 15px;
  }

  .history-header__icon {
    display: none;
  }

  .history-header__title {
    font-size: 1.35rem;
  }

  .history-panel {
    padding: 15px;
  }

  .history-panel__header {
    align-items: stretch;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
    margin-top: 14px;
  }

  .filters-panel {
    grid-template-columns: 1fr;
  }

  .filter-field--search,
  .filter-actions {
    grid-column: auto;
  }

  .filter-actions {
    flex-direction: column;
  }

  .apply-button,
  .clear-button {
    width: 100%;
  }

  .table-toolbar,
  .history-pagination {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .limit-selector {
    justify-content: space-between;
  }
}
</style>
