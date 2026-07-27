<template>
  <div class="pos-page">
    <v-container fluid class="pa-3 pa-md-6">

      <!-- Encabezado principal -->
      <section class="hero-section mb-6">
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <div class="d-flex flex-column flex-lg-row align-lg-center">
            <div class="d-flex align-center">
              <div class="brand-icon mr-4">
                <v-icon color="white" size="34">
                  mdi-point-of-sale
                </v-icon>
              </div>

              <div>
                <div class="hero-label">
                  SISTEMA DE PUNTO DE VENTA
                </div>

                <h1 class="hero-title mb-1">
                  Enterprise POS
                </h1>

                <p class="hero-description mb-0">
                  Administra productos y registra ventas de forma rápida.
                </p>
              </div>
            </div>

            <v-spacer />

            <div class="hero-actions mt-5 mt-lg-0">
              <div class="connection-status mr-lg-3 mb-3 mb-lg-0">
                <span class="status-dot"></span>
                API conectada
              </div>

              <v-btn
                color="white"
                class="primary--text font-weight-bold"
                depressed
                large
                @click="openProductDialog"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>

                Nuevo producto
              </v-btn>
            </div>
          </div>
        </div>
      </section>

      <!-- Indicadores -->
      <v-row class="mb-2">
        <v-col
          v-for="stat in stats"
          :key="stat.label"
          cols="12"
          sm="6"
          lg="3"
        >
          <div class="stat-card">
            <div
              class="stat-icon"
              :class="stat.iconClass"
            >
              <v-icon :color="stat.color">
                {{ stat.icon }}
              </v-icon>
            </div>

            <div>
              <div class="stat-label">
                {{ stat.label }}
              </div>

              <div class="stat-value">
                {{ stat.value }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Contenido principal -->
      <v-row align="start">
        <v-col
          cols="12"
          lg="8"
          xl="9"
        >
          <section class="enterprise-card pa-4 pa-md-6">
            <div
              class="d-flex flex-column flex-md-row
                     align-md-center mb-5"
            >
              <div>
                <div class="section-heading">
                  Catálogo de productos
                </div>

                <div class="section-subheading">
                  Selecciona un producto para agregarlo a la venta.
                </div>
              </div>

              <v-spacer />

              <v-btn
                text
                color="primary"
                class="mt-3 mt-md-0"
                @click="loadProducts"
              >
                <v-icon left>
                  mdi-refresh
                </v-icon>

                Actualizar
              </v-btn>
            </div>

            <!-- Buscador -->
            <div class="search-wrapper mb-6">
              <v-icon
                color="primary"
                class="search-leading-icon"
              >
                mdi-magnify
              </v-icon>

              <input
                v-model="search"
                type="text"
                class="enterprise-search"
                placeholder="Buscar por nombre o código de barras..."
              >

              <v-btn
                v-if="search"
                icon
                small
                class="search-clear"
                @click="search = ''"
              >
                <v-icon small>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>

            <!-- Cargando -->
            <div
              v-if="loading"
              class="py-8"
            >
              <v-row>
                <v-col
                  v-for="item in 6"
                  :key="item"
                  cols="12"
                  sm="6"
                  xl="4"
                >
                  <v-skeleton-loader
                    type="card"
                    class="rounded-skeleton"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Sin productos -->
            <div
              v-else-if="products.length === 0"
              class="empty-state"
            >
              <div class="empty-icon">
                <v-icon
                  size="58"
                  color="primary"
                >
                  mdi-package-variant-closed
                </v-icon>
              </div>

              <h3 class="empty-title">
                No hay productos disponibles
              </h3>

              <p class="empty-description">
                Registra el primer producto para comenzar a vender.
              </p>

              <v-btn
                color="primary"
                depressed
                large
                @click="openProductDialog"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>

                Registrar producto
              </v-btn>
            </div>

            <!-- Productos -->
            <v-row v-else>
              <v-col
                v-for="product in products"
                :key="product.id"
                cols="12"
                sm="6"
                xl="4"
              >
                <ProductCard
                  :product="product"
                  @add="addToSale"
                />
              </v-col>
            </v-row>
          </section>
        </v-col>

        <!-- Panel venta -->
        <v-col
          cols="12"
          lg="4"
          xl="3"
        >
          <section class="enterprise-card sale-card pa-4 pa-md-5">
            <div class="d-flex align-center">
              <div class="cart-icon mr-3">
                <v-icon color="primary">
                  mdi-cart-outline
                </v-icon>
              </div>

              <div>
                <div class="section-heading">
                  Venta actual
                </div>

                <div class="section-subheading">
                  {{ saleItems.length }} producto(s) agregado(s)
                </div>
              </div>

              <v-spacer />

              <v-btn
                icon
                :disabled="saleItems.length === 0"
                @click="clearSale"
              >
                <v-icon>
                  mdi-delete-sweep-outline
                </v-icon>
              </v-btn>
            </div>

            <v-divider class="my-5 soft-divider" />

            <div
              v-if="saleItems.length === 0"
              class="cart-empty"
            >
              <div class="cart-empty-icon">
                <v-icon
                  size="52"
                  color="blue-grey lighten-2"
                >
                  mdi-cart-arrow-down
                </v-icon>
              </div>

              <div class="cart-empty-title">
                Venta vacía
              </div>

              <div class="cart-empty-text">
                Selecciona productos del catálogo para agregarlos.
              </div>
            </div>

            <div
              v-else
              class="cart-items"
            >
              <div
                v-for="(item, index) in saleItems"
                :key="`${item.id}-${index}`"
                class="cart-item"
              >
                <div class="d-flex justify-space-between">
                  <div class="cart-item-info">
                    <div class="cart-item-name">
                      {{ item.name }}
                    </div>

                    <div class="cart-item-code">
                      {{ item.barcode }}
                    </div>
                  </div>

                  <v-btn
                    icon
                    small
                    color="error"
                    @click="removeFromSale(index)"
                  >
                    <v-icon small>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>

                <div class="d-flex align-center mt-3">
                  <v-text-field
                    v-model.number="item.price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    dense
                    outlined
                    hide-details
                    prefix="$"
                    class="price-input"
                  />

                  <div class="cart-item-price ml-3">
                    {{ formatCurrency(item.price) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="sale-footer">
              <v-divider class="my-5 soft-divider" />

              <div class="subtotal-row">
                <span>Subtotal</span>
                <span>{{ formatCurrency(total) }}</span>
              </div>

              <div class="total-row mt-2">
                <span>Total</span>
                <span>{{ formatCurrency(total) }}</span>
              </div>

              <v-btn
                color="primary"
                block
                x-large
                depressed
                class="save-sale-btn mt-5"
                :disabled="saleItems.length === 0"
                @click="saveSale"
              >
                <v-icon left>
                  mdi-check-circle-outline
                </v-icon>

                Guardar venta
              </v-btn>

              <div class="secure-message mt-3">
                <v-icon
                  small
                  color="success"
                  class="mr-1"
                >
                  mdi-shield-check-outline
                </v-icon>

                La venta será almacenada en la base de datos
              </div>
            </div>
          </section>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ProductCard from "@/components/products/ProductCard.vue";
import productService from "@/services/product.service";

export default {
  name: "PosView",

  components: {
    ProductCard
  },

  data() {
    return {
      search: "",
      products: [],
      saleItems: [],
      loading: false,
      searchTimer: null
    };
  },

  computed: {
    total() {
      return this.saleItems.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
      );
    },

    stats() {
      return [
        {
          label: "Productos registrados",
          value: this.products.length,
          icon: "mdi-package-variant",
          color: "primary",
          iconClass: "stat-icon--blue"
        },
        {
          label: "Productos en venta",
          value: this.saleItems.length,
          icon: "mdi-cart",
          color: "success",
          iconClass: "stat-icon--green"
        },
        {
          label: "Total actual",
          value: this.formatCurrency(this.total),
          icon: "mdi-cash-multiple",
          color: "warning",
          iconClass: "stat-icon--orange"
        },
        {
          label: "Estado del sistema",
          value: "Operativo",
          icon: "mdi-server-network",
          color: "info",
          iconClass: "stat-icon--cyan"
        }
      ];
    }
  },

  watch: {
    search() {
      clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(() => {
        this.loadProducts();
      }, 350);
    }
  },

  created() {
    this.loadProducts();
  },

  beforeDestroy() {
    clearTimeout(this.searchTimer);
  },

  methods: {
    async loadProducts() {
      this.loading = true;

      try {
        const response = await productService.getAll({
          search: this.search,
          page: 1,
          limit: 12
        });

        this.products = response.data.products;
      } catch (error) {
        console.error(error);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    addToSale(product) {
      this.saleItems.push({
        id: product.id,
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        price: Number(product.price)
      });
    },

    removeFromSale(index) {
      this.saleItems.splice(index, 1);
    },

    clearSale() {
      this.saleItems = [];
    },

    openProductDialog() {
      console.log("Abrir modal de producto");
    },

    saveSale() {
      console.log("Guardar venta", this.saleItems);
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(Number(value || 0));
    }
  }
};
</script>

<style scoped lang="scss">
.pos-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.08),
      transparent 28%
    ),
    #f3f6fb;
}

.hero-section {
  position: relative;
  overflow: hidden;
  padding: 30px;
  border-radius: 24px;
  color: white;
  background:
    linear-gradient(
      120deg,
      #0f172a 0%,
      #1e3a8a 50%,
      #2563eb 100%
    );
  box-shadow: 0 18px 45px rgba(30, 64, 175, 0.22);
}

.hero-overlay {
  position: absolute;
  top: -100px;
  right: -60px;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.brand-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.72);
}

.hero-title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.hero-description {
  color: rgba(255, 255, 255, 0.78);
}

.hero-actions {
  display: flex;
  align-items: center;
}

.connection-status {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
}

.status-dot {
  width: 9px;
  height: 9px;
  margin-right: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 5px rgba(74, 222, 128, 0.15);
}

.stat-card {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 18px;
  background: white;
  border: 1px solid #e7edf5;
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  border-radius: 14px;

  &--blue {
    background: #eff6ff;
  }

  &--green {
    background: #f0fdf4;
  }

  &--orange {
    background: #fff7ed;
  }

  &--cyan {
    background: #ecfeff;
  }
}

.stat-label {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 600;
}

.stat-value {
  margin-top: 3px;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 900;
}

.section-heading {
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 900;
}

.section-subheading {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.82rem;
}

.search-wrapper {
  position: relative;
}

.enterprise-search {
  width: 100%;
  height: 54px;
  padding: 0 50px;
  border: 1px solid #dbe4ef;
  border-radius: 15px;
  outline: none;
  color: #0f172a;
  font-size: 0.95rem;
  background: #f8fafc;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
}

.search-leading-icon {
  position: absolute;
  top: 15px;
  left: 17px;
  z-index: 1;
}

.search-clear {
  position: absolute;
  top: 7px;
  right: 8px;
}

.empty-state {
  min-height: 430px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon,
.cart-empty-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background: linear-gradient(145deg, #eff6ff, #dbeafe);
}

.empty-title {
  margin-top: 22px;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 900;
}

.empty-description {
  margin-top: 6px;
  margin-bottom: 24px;
  color: #64748b;
}

.sale-card {
  min-height: 680px;
  display: flex;
  flex-direction: column;
}

.cart-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: #eff6ff;
}

.cart-empty {
  flex: 1;
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cart-empty-title {
  margin-top: 18px;
  color: #0f172a;
  font-weight: 800;
}

.cart-empty-text {
  max-width: 220px;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 0.82rem;
}

.cart-items {
  flex: 1;
  max-height: 430px;
  overflow-y: auto;
}

.cart-item {
  padding: 15px 0;
  border-bottom: 1px solid #eef2f7;
}

.cart-item-name {
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 800;
}

.cart-item-code {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 0.7rem;
}

.cart-item-price {
  color: #1d4ed8;
  font-weight: 800;
}

.price-input {
  max-width: 135px;
}

.sale-footer {
  margin-top: auto;
}

.subtotal-row {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.88rem;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #0f172a;
  font-size: 1.4rem;
  font-weight: 900;
}

.total-row span:last-child {
  color: #1d4ed8;
  font-size: 1.8rem;
}

.save-sale-btn {
  border-radius: 14px;
  text-transform: none;
  font-weight: 800;
}

.secure-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.7rem;
  text-align: center;
}

.rounded-skeleton {
  border-radius: 16px;
  overflow: hidden;
}

@media (min-width: 1264px) {
  .sale-card {
    position: sticky;
    top: 24px;
  }
}

@media (max-width: 960px) {
  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 22px 18px;
    border-radius: 18px;
  }

  .brand-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
  }

  .hero-title {
    font-size: 1.55rem;
  }

  .hero-description {
    font-size: 0.82rem;
  }

  .sale-card {
    min-height: 560px;
  }
}
</style>