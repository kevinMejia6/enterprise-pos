<template>
  <div class="pos-shell" :class="{ 'pos-shell--collapsed': sidebarCollapsed }">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @toggle="toggleSidebar"
      @close-mobile="closeMobileSidebar"
    />

    <div
      v-if="mobileSidebarOpen"
      class="sidebar-overlay"
      @click="closeMobileSidebar"
    />

    <main class="pos-content">
      <header class="pos-header">
        <div class="pos-header__decoration pos-header__decoration--one" />

        <div class="pos-header__decoration pos-header__decoration--two" />

        <div class="pos-header__content">
          <div class="pos-header__brand">
            <v-btn
              icon
              dark
              class="mobile-menu-btn mr-2"
              @click="mobileSidebarOpen = true"
            >
              <v-icon> mdi-menu </v-icon>
            </v-btn>

            <div class="pos-header__icon">
              <v-icon color="white" size="32">
                mdi-package-variant-closed
              </v-icon>
            </div>

            <div>
              <div class="pos-header__eyebrow">SISTEMA DE PUNTO DE VENTA</div>

              <h1 class="pos-header__title">Enterprise POS</h1>

              <p class="pos-header__description">
                Administra productos y registra ventas rápidamente.
              </p>
            </div>
          </div>

          <div class="pos-header__actions">
            <v-btn
              color="white"
              depressed
              large
              class="new-product-btn"
              @click="openProductDialog()"
            >
              <v-icon left color="primary"> mdi-plus </v-icon>

              Nuevo producto
            </v-btn>
          </div>
        </div>
      </header>

      <v-row class="summary-grid">
        <v-col
          v-for="item in summaryItems"
          :key="item.label"
          cols="12"
          sm="6"
          lg="3"
        >
          <article class="summary-card">
            <div class="summary-card__icon" :class="item.backgroundClass">
              <v-icon :color="item.color">
                {{ item.icon }}
              </v-icon>
            </div>

            <div>
              <div class="summary-card__label">
                {{ item.label }}
              </div>

              <div class="summary-card__value">
                {{ item.value }}
              </div>

              <div class="summary-card__description">
                {{ item.description }}
              </div>
            </div>
          </article>
        </v-col>
      </v-row>

      <v-row align="start">
        <v-col cols="12" lg="8" xl="9">
          <section class="panel-card product-panel">
            <div class="panel-header">
              <div class="panel-header__identity">
                <div class="panel-header__icon">
                  <v-icon color="primary"> mdi-package-variant-closed </v-icon>
                </div>

                <div>
                  <h2 class="panel-header__title">Catálogo de productos</h2>

                  <p class="panel-header__description">
                    Busca y selecciona productos para agregarlos a la venta.
                  </p>
                </div>
              </div>

              <div class="panel-header__actions">
                <v-btn
                  outlined
                  color="primary"
                  class="panel-action-btn panel-action-btn--secondary"
                  :loading="loading"
                  @click="loadProducts"
                >
                  <v-icon left size="19"> mdi-refresh </v-icon>

                  Actualizar
                </v-btn>

                <v-btn
                  color="primary"
                  depressed
                  class="panel-action-btn panel-action-btn--primary"
                  @click="openProductDialog()"
                >
                  <v-icon left size="19"> mdi-plus </v-icon>

                  Nuevo
                </v-btn>
              </div>
            </div>

            <div class="catalog-toolbar">
              <div class="catalog-search">
                <v-icon class="catalog-search__icon"> mdi-magnify </v-icon>

                <input
                  v-model="search"
                  type="text"
                  placeholder="Buscar por nombre o código de barras..."
                />

                <v-btn
                  v-if="search"
                  icon
                  small
                  class="catalog-search__clear"
                  @click="search = ''"
                >
                  <v-icon small> mdi-close </v-icon>
                </v-btn>
              </div>

              <div class="catalog-sort">
                <span class="catalog-sort__label"> Ordenar por </span>

                <select v-model="sortOrder">
                  <option value="recent">Más recientes</option>

                  <option value="name">Nombre</option>

                  <option value="price">Precio</option>
                </select>
              </div>

              <div class="view-switch">
                <v-btn
                  icon
                  class="view-switch__button view-switch__button--active"
                >
                  <v-icon> mdi-view-grid-outline </v-icon>
                </v-btn>

                <v-btn icon class="view-switch__button">
                  <v-icon> mdi-format-list-bulleted </v-icon>
                </v-btn>
              </div>
            </div>

            <v-row v-if="loading">
              <v-col v-for="item in 8" :key="item" cols="12" sm="6" xl="3">
                <v-skeleton-loader type="card" class="product-skeleton" />
              </v-col>
            </v-row>

            <div v-else-if="products.length === 0" class="products-empty">
              <div class="products-empty__illustration">
                <div class="products-empty__circle">
                  <v-icon color="primary" size="68">
                    mdi-package-variant
                  </v-icon>
                </div>

                <span class="sparkle sparkle--one"> ✦ </span>

                <span class="sparkle sparkle--two"> ✦ </span>
              </div>

              <h3 class="products-empty__title">
                No hay productos disponibles
              </h3>

              <p class="products-empty__description">
                Registra el primer producto para comenzar a vender.
              </p>

              <v-btn
                color="primary"
                depressed
                large
                class="register-product-btn"
                @click="openProductDialog()"
              >
                <v-icon left> mdi-plus </v-icon>

                Registrar producto
              </v-btn>

              <div class="search-tip">
                <v-icon color="primary" class="mr-3"> mdi-barcode-scan </v-icon>

                Tip: puedes buscar por nombre o escanear el código de barras.
              </div>
            </div>

            <v-row v-else>
              <v-col
                v-for="product in sortedProducts"
                :key="product.id"
                cols="12"
                sm="6"
                xl="3"
              >
                <ProductCard
                  :product="product"
                  @add="addToSale"
                  @edit="openProductDialog"
                />
              </v-col>
            </v-row>

            <div v-if="pagination.totalPages > 1" class="catalog-pagination">
              <v-pagination
                v-model="pagination.currentPage"
                :length="pagination.totalPages"
                :total-visible="6"
                color="primary"
                @input="loadProducts"
              />
            </div>
          </section>
        </v-col>

        <v-col cols="12" lg="4" xl="3">
          <SalePanel
            :items="saleItems"
            :total="total"
            :total-units="totalUnits"
            :saving="savingSale"
            @increase="increaseQuantity"
            @decrease="decreaseQuantity"
            @remove="removeFromSale"
            @clear="clearSale"
            @save="saveSale"
            @image-error="markSaleItemImageError"
            @update-price="updateSaleItemPrice"
            @validate-price="validateSaleItemPrice"
          />
        </v-col>
      </v-row>
    </main>

    <ProductDialog
      v-model="productDialog"
      :product="selectedProduct"
      :loading="savingProduct"
      :error-message="productError"
      @save="saveProduct"
      @close="closeProductDialog"
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
import ProductCard from "@/components/products/ProductCard.vue";
import ProductDialog from "@/components/products/ProductDialog.vue";
import AppSnackbar from "@/components/common/AppSnackbar.vue";
import SalePanel from "@/components/sales/SalePanel.vue";
import productService from "@/services/product.service";
import saleService from "@/services/sale.service";

export default {
  name: "PosView",

  components: {
    ProductCard,
    ProductDialog,
    AppSnackbar,
    SalePanel,
    AppSidebar,
  },

  data() {
    return {
      sidebarCollapsed: false,
      mobileSidebarOpen: false,

      search: "",
      sortOrder: "recent",
      products: [],
      saleItems: [],
      loading: false,
      savingSale: false,
      searchTimer: null,

      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 12,
      },

      productDialog: false,
      selectedProduct: null,
      savingProduct: false,
      productError: "",

      snackbar: {
        visible: false,
        message: "",
        color: "success",
      },
    };
  },

  computed: {
    total() {
      return this.saleItems.reduce((sum, item) => {
        return sum + Number(item.price || 0) * Number(item.quantity || 1);
      }, 0);
    },

    totalUnits() {
      return this.saleItems.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
      }, 0);
    },

    activeProductsCount() {
      return this.products.filter((product) => product.active).length;
    },


    sortedProducts() {
      const products = [...this.products];

      if (this.sortOrder === "name") {
        return products.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (this.sortOrder === "price") {
        return products.sort((a, b) => Number(a.price) - Number(b.price));
      }

      return products.sort((a, b) => b.id - a.id);
    },

    summaryItems() {
      return [
        {
          label: "Productos encontrados",
          value: this.pagination.totalItems,
          description: "En catálogo",
          icon: "mdi-package-variant",
          color: "primary",
          backgroundClass: "summary-card__icon--blue",
        },
        {
          label: "Unidades en venta",
          value: this.totalUnits,
          description: "En el carrito",
          icon: "mdi-cart",
          color: "success",
          backgroundClass: "summary-card__icon--green",
        },
        {
          label: "Total actual",
          value: this.formatCurrency(this.total),
          description: "Valor de la venta",
          icon: "mdi-cash-multiple",
          color: "orange",
          backgroundClass: "summary-card__icon--orange",
        },
        {
          label: "Productos activos",
          value: this.activeProductsCount,
          description: "Disponibles para vender",
          icon: "mdi-check-decagram",
          color: "purple",
          backgroundClass: "summary-card__icon--purple",
        },
      ];
    },
  },

  watch: {
    search() {
      clearTimeout(this.searchTimer);

      this.pagination.currentPage = 1;

      this.searchTimer = setTimeout(() => {
        this.loadProducts();
      }, 350);
    },
  },

  created() {
    this.loadProducts();
  },

  beforeDestroy() {
    clearTimeout(this.searchTimer);
  },

  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    closeMobileSidebar() {
      this.mobileSidebarOpen = false;
    },

    async loadProducts() {
      this.loading = true;

      try {
        const response = await productService.getProducts(
          this.search,
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
        );

        this.products = response.products || [];

        if (response.pagination) {
          this.pagination = {
            ...this.pagination,
            ...response.pagination,
          };
        }
      } catch (error) {
        this.products = [];

        this.showSnackbar(
          error.message || "No fue posible cargar los productos",
          "error",
        );
      } finally {
        this.loading = false;
      }
    },

    openProductDialog(product = null) {
      this.selectedProduct = product;
      this.productError = "";
      this.productDialog = true;
    },

    closeProductDialog() {
      if (this.savingProduct) {
        return;
      }

      this.productDialog = false;
      this.selectedProduct = null;
      this.productError = "";
    },

    async saveProduct(productData) {
      this.savingProduct = true;
      this.productError = "";

      try {
        if (productData.id) {
          await productService.updateProduct(productData.id, productData);

          this.showSnackbar("Producto actualizado correctamente", "success");
        } else {
          await productService.createProduct(productData);

          this.showSnackbar("Producto creado correctamente", "success");
        }

        this.productDialog = false;
        this.selectedProduct = null;

        await this.loadProducts();
      } catch (error) {
        this.productError =
          error.message || "No fue posible guardar el producto";

        this.showSnackbar(this.productError, "error");
      } finally {
        this.savingProduct = false;
      }
    },

    addToSale(product) {
      const existingItem = this.saleItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.saleItems.push({
          lineId: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          barcode: product.barcode,
          imageUrl: product.imageUrl || product.image_url || null,
          imageError: false,
          price: Number(product.price),
          quantity: 1,
        });
      }

      this.showSnackbar(`${product.name} agregado a la venta`, "success");
    },

    increaseQuantity(item) {
      item.quantity += 1;
    },

    decreaseQuantity(index) {
      const item = this.saleItems[index];

      if (item.quantity > 1) {
        item.quantity -= 1;
        return;
      }

      this.saleItems.splice(index, 1);
    },

    markSaleItemImageError(index) {
      const item = this.saleItems[index];

      if (item) {
        this.$set(item, "imageError", true);
      }
    },

    removeFromSale(index) {
      this.saleItems.splice(index, 1);
    },

    clearSale() {
      this.saleItems = [];

      this.showSnackbar("La venta fue limpiada", "info");
    },

    updateSaleItemPrice({ index, value }) {
      const item = this.saleItems[index];

      if (!item) {
        return;
      }

      const numericPrice = Number(value);

      this.$set(
        this.saleItems[index],
        "price",
        Number.isFinite(numericPrice) ? numericPrice : 0,
      );
    },

    validateSaleItemPrice(item) {
      const price = Number(item.price);

      if (!Number.isFinite(price) || price <= 0) {
        item.price = 0.01;

        this.showSnackbar("El precio debe ser mayor que cero", "warning");

        return;
      }

      item.price = Number(price.toFixed(2));
    },

    async saveSale() {
      if (this.saleItems.length === 0) {
        this.showSnackbar("Debes agregar al menos un producto", "warning");

        return;
      }

      const hasInvalidItems = this.saleItems.some((item) => {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        return (
          !Number.isInteger(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(price) ||
          price <= 0
        );
      });

      if (hasInvalidItems) {
        this.showSnackbar(
          "Revisa las cantidades y precios de la venta",
          "warning",
        );

        return;
      }

      this.savingSale = true;

      try {
        const sale = await saleService.createSale(this.saleItems);

        this.saleItems = [];

        this.showSnackbar(
          `Venta ${sale.saleNumber} registrada correctamente`,
          "success",
        );

        await this.loadProducts();
      } catch (error) {
        console.error("Error al guardar la venta:", error);

        const message =
          error.response?.data?.message ||
          error.message ||
          "No fue posible registrar la venta";

        this.showSnackbar(message, "error");
      } finally {
        this.savingSale = false;
      }
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

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value || 0));
    },

    goToSalesHistory() {
      this.mobileSidebarOpen = false;
      this.$router.push("/ventas");
    },
  },
};
</script>

<style scoped lang="scss">
.panel-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-action-btn {
  min-width: 138px !important;
  height: 44px !important;
  padding: 0 20px !important;
  border-radius: 12px !important;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;

  &--secondary {
    border-width: 1px !important;
    background: #ffffff !important;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  }

  &--primary {
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.22);
  }
}
.pos-shell {
  min-height: 100vh;
  display: flex;
  background: #f4f7fc;
}


.pos-content {
  width: calc(100% - 220px);
  margin-left: 220px;
  padding: 0 18px 24px;
  transition:
    width 0.25s ease,
    margin-left 0.25s ease;
}

.pos-shell--collapsed {
  .pos-content {
    width: calc(100% - 72px);
    margin-left: 72px;
  }
}

.pos-header {
  position: relative;
  min-height: 122px;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 18px;
  padding: 24px 30px;
  border-radius: 0 0 22px 22px;
  color: white;
  background: linear-gradient(115deg, #0d348e 0%, #104ec7 55%, #2563eb 100%);
  box-shadow: 0 14px 35px rgba(26, 76, 181, 0.2);
}

.pos-header__decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);

  &--one {
    top: -180px;
    right: 260px;
    width: 500px;
    height: 360px;
  }

  &--two {
    right: -80px;
    bottom: -180px;
    width: 430px;
    height: 380px;
  }
}

.pos-header__content {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pos-header__brand {
  display: flex;
  align-items: center;
}

.pos-header__icon {
  width: 60px;
  height: 60px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  border-radius: 16px;
  background: linear-gradient(145deg, #2563eb, #1548c5);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.pos-header__eyebrow {
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.8;
}

.pos-header__title {
  margin: 3px 0;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.pos-header__description {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.82;
}

.pos-header__actions {
  display: flex;
  align-items: center;
}

.new-product-btn {
  border-radius: 11px;
  color: #174bb9 !important;
  text-transform: none;
  font-weight: 800;
}

.mobile-menu-btn {
  display: none;
}

.summary-grid {
  margin-bottom: 6px;
}

.summary-card {
  min-height: 105px;
  display: flex;
  align-items: center;
  padding: 18px;
  border: 1px solid #e5ebf4;
  border-radius: 18px;
  background: white;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);
}

.summary-card__icon {
  width: 54px;
  height: 54px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
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

  &--purple {
    background: #f2eaff;
  }
}

.summary-card__label {
  color: #64748b;
  font-size: 0.69rem;
  font-weight: 700;
}

.summary-card__value {
  margin-top: 4px;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 900;
}

.summary-card__description {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.66rem;
}

.panel-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  background: white;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.product-panel {
  min-height: 660px;
  padding: 20px;
}

.panel-header,
.sale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header__identity {
  display: flex;
  align-items: center;
}

.panel-header__icon {
  width: 42px;
  height: 42px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  background: #eef5ff;
}

.panel-header__title {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

.panel-header__description {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 0.72rem;
}

.catalog-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 210px auto;
  gap: 14px;
  margin: 20px 0;
}

.catalog-search {
  position: relative;
}

.catalog-search input {
  width: 100%;
  height: 51px;
  padding: 0 45px;
  border: 1px solid #dce5f1;
  border-radius: 12px;
  outline: none;
  color: #0f172a;
  background: white;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.09);
  }
}

.catalog-search__icon {
  position: absolute;
  top: 13px;
  left: 14px;
  color: #64748b;
}

.catalog-search__clear {
  position: absolute;
  top: 6px;
  right: 5px;
}

.catalog-sort {
  height: 51px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6px 13px;
  border: 1px solid #dce5f1;
  border-radius: 12px;
}

.catalog-sort__label {
  color: #94a3b8;
  font-size: 0.59rem;
}

.catalog-sort select {
  border: none;
  outline: none;
  color: #0f172a;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 800;
}

.view-switch {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-switch__button {
  border: 1px solid #dce5f1;
  border-radius: 9px;

  &--active {
    color: white !important;
    background: #1856d8;
  }
}

.products-empty {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.products-empty__illustration {
  position: relative;
}

.products-empty__circle {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, #e8efff 0%, #f4f7ff 68%);
}

.sparkle {
  position: absolute;
  color: #a8bdf6;

  &--one {
    top: 12px;
    left: -4px;
  }

  &--two {
    top: -3px;
    right: 6px;
    font-size: 1.4rem;
  }
}

.products-empty__title {
  margin: 18px 0 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 900;
}

.products-empty__description {
  margin: 7px 0 22px;
  color: #64748b;
  font-size: 0.83rem;
}

.register-product-btn {
  min-width: 220px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 800;
}

.search-tip {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 70px;
  padding: 17px;
  border: 1px dashed #cdd9eb;
  border-radius: 10px;
  color: #64748b;
  font-size: 0.72rem;
}

.catalog-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.product-skeleton {
  overflow: hidden;
  border-radius: 14px;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 960px) {
  .pos-shell--collapsed .pos-content,
  .pos-content {
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

  .pos-header__content {
    align-items: flex-start;
    flex-direction: column;
  }

  .pos-header__actions {
    width: 100%;
    margin-top: 20px;
  }

  .new-product-btn {
    width: 100%;
  }

  .catalog-toolbar {
    grid-template-columns: 1fr;
  }

  .view-switch {
    display: none;
  }
}

@media (max-width: 600px) {
  .pos-content {
    padding: 0 10px 18px;
  }

  .pos-header {
    padding: 20px 17px;
  }

  .pos-header__icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .pos-header__title {
    font-size: 1.4rem;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-header__actions {
    width: 100%;
    display: flex;
    margin-top: 15px;
  }

  .panel-header__actions .v-btn {
    flex: 1;
  }

  .products-empty {
    min-height: 450px;
  }

  .search-tip {
    width: 100%;
    margin-top: 45px;
  }
}
</style>
