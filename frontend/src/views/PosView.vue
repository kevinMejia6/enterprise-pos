  <template>
    <div class="pos-shell" :class="{ 'pos-shell--collapsed': sidebarCollapsed }">
      <aside
        class="pos-sidebar"
        :class="{
          'pos-sidebar--collapsed': sidebarCollapsed,
          'pos-sidebar--mobile-open': mobileSidebarOpen,
        }"
      >
        <v-btn icon dark class="sidebar-toggle" @click="toggleSidebar">
          <v-icon>
            {{ sidebarCollapsed ? "mdi-chevron-right" : "mdi-chevron-left" }}
          </v-icon>
        </v-btn>

        <div class="sidebar-brand">
          <div class="sidebar-brand__icon">
            <v-icon color="white" size="28"> mdi-cart-variant </v-icon>
          </div>

          <div v-if="!sidebarCollapsed" class="sidebar-brand__title">POS</div>

          <div v-if="!sidebarCollapsed" class="sidebar-brand__subtitle">
            Punto de venta
          </div>
        </div>

        <div
          class="sidebar-option sidebar-option--active"
          @click="closeMobileSidebar"
        >
          <v-icon color="white" :class="{ 'mr-3': !sidebarCollapsed }">
            mdi-cart-outline
          </v-icon>

          <div v-if="!sidebarCollapsed">
            <div class="sidebar-option__title">POS</div>

            <div class="sidebar-option__description">Punto de venta</div>
          </div>
        </div>

        <div v-if="!sidebarCollapsed" class="sidebar-status">
          <div class="sidebar-status__label">Estado del sistema</div>

          <div class="sidebar-status__value">
            <span class="sidebar-status__dot" />
            Operativo
          </div>

          <v-divider dark class="my-4" />

          <div class="sidebar-status__date">
            {{ currentDate }}
          </div>
        </div>
      </aside>

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
            <section class="panel-card sale-panel">
              <div class="sale-header">
                <div class="panel-header__identity">
                  <div class="panel-header__icon">
                    <v-icon color="primary"> mdi-cart-outline </v-icon>
                  </div>

                  <div>
                    <h2 class="panel-header__title">Venta actual</h2>

                    <p class="panel-header__description">
                      {{ totalUnits }} unidad(es) agregada(s)
                    </p>
                  </div>
                </div>

                <v-btn
                  icon
                  color="error"
                  :disabled="saleItems.length === 0"
                  @click="clearSale"
                >
                  <v-icon> mdi-delete-outline </v-icon>
                </v-btn>
              </div>

              <v-divider />

              <div v-if="saleItems.length === 0" class="sale-empty">
                <div class="sale-empty__icon">
                  <v-icon color="primary" size="64"> mdi-cart-arrow-down </v-icon>
                </div>

                <h3 class="sale-empty__title">Venta vacía</h3>

                <p class="sale-empty__description">
                  Selecciona productos del catálogo para agregarlos a la venta.
                </p>
              </div>

              <div v-else class="sale-items">
                <article
                  v-for="(item, index) in saleItems"
                  :key="item.lineId"
                  class="sale-item"
                >
                  <div class="sale-item__visual">
                    <v-img
                      v-if="item.imageUrl && !item.imageError"
                      :src="item.imageUrl"
                      :alt="item.name"
                      contain
                      max-height="42"
                      max-width="42"
                      @error="$set(item, 'imageError', true)"
                    />

                    <v-icon v-else color="primary"> mdi-package-variant </v-icon>
                  </div>

                  <div class="sale-item__content">
                    <div class="sale-item__top">
                      <div class="sale-item__info">
                        <div class="sale-item__name">
                          {{ item.name }}
                        </div>

                        <div class="sale-item__barcode">
                          Código: {{ item.barcode }}
                        </div>
                      </div>

                      <v-btn
                        icon
                        small
                        color="error"
                        @click="removeFromSale(index)"
                      >
                        <v-icon small> mdi-delete-outline </v-icon>
                      </v-btn>
                    </div>

                    <div class="sale-item__bottom">
                      <div class="sale-item__quantity">
                        <v-btn
                          icon
                          x-small
                          class="quantity-button"
                          @click="decreaseQuantity(index)"
                        >
                          <v-icon size="16">mdi-minus</v-icon>
                        </v-btn>

                        <span class="quantity-value">
                          {{ item.quantity }}
                        </span>

                        <v-btn
                          icon
                          x-small
                          class="quantity-button"
                          @click="increaseQuantity(item)"
                        >
                          <v-icon size="16">mdi-plus</v-icon>
                        </v-btn>
                      </div>

                      <div class="sale-item__subtotal">
                        {{ formatCurrency(item.price * item.quantity) }}
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div class="sale-summary">
                <v-divider class="mb-5" />

                <div class="sale-summary__row">
                  <span>Productos diferentes</span>
                  <strong>{{ saleItems.length }}</strong>
                </div>

                <div class="sale-summary__row">
                  <span>Unidades</span>
                  <strong>{{ totalUnits }}</strong>
                </div>

                <div class="sale-summary__row">
                  <span>Subtotal</span>
                  <strong>{{ formatCurrency(total) }}</strong>
                </div>

                <v-divider class="my-4" />

                <div class="sale-summary__total">
                  <span>Total</span>
                  <strong>{{ formatCurrency(total) }}</strong>
                </div>

                <v-btn
                  color="success"
                  block
                  x-large
                  depressed
                  class="save-sale-btn mt-5"
                  :disabled="saleItems.length === 0"
                  @click="saveSale"
                >
                  <v-icon left> mdi-content-save-outline </v-icon>

                  Guardar venta
                </v-btn>

                <div class="sale-security">
                  <v-icon small color="primary" class="mr-2">
                    mdi-shield-check-outline
                  </v-icon>

                  La venta se registrará en el sistema
                </div>
              </div>
            </section>
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
  import ProductCard from "@/components/products/ProductCard.vue";
  import ProductDialog from "@/components/products/ProductDialog.vue";
  import AppSnackbar from "@/components/common/AppSnackbar.vue";
  import productService from "@/services/product.service";

  export default {
    name: "PosView",

    components: {
      ProductCard,
      ProductDialog,
      AppSnackbar,
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
          return (
            sum +
            Number(item.price || 0) *
              Number(item.quantity || 1)
          );
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

      currentDate() {
        return new Intl.DateTimeFormat("es-SV", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date());
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
            imageUrl:
              product.imageUrl ||
              product.image_url ||
              null,
            imageError: false,
            price: Number(product.price),
            quantity: 1,
          });
        }

        this.showSnackbar(
          `${product.name} agregado a la venta`,
          "success",
        );
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

      removeFromSale(index) {
        this.saleItems.splice(index, 1);
      },

      clearSale() {
        this.saleItems = [];

        this.showSnackbar("La venta fue limpiada", "info");
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

      saveSale() {
        this.showSnackbar(
          "El guardado se integrará en el módulo de ventas",
          "info",
        );
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

  .pos-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    width: 185px;
    display: flex;
    flex-direction: column;
    padding: 24px 14px;
    color: white;
    background: linear-gradient(180deg, #061a45 0%, #06265c 48%, #041c48 100%);
    transition: width 0.25s ease, transform 0.25s ease;

    &--collapsed {
      width: 64px;
      padding: 18px 6px;

      .sidebar-brand {
        margin-top: 4px;
      }

      .sidebar-brand__icon {
        width: 46px;
        height: 46px;
        margin-bottom: 0;
        border-radius: 14px;
      }

      .sidebar-option {
        justify-content: center;
        margin-top: 22px;
        padding: 11px 6px;
        border-radius: 12px;
      }

      .sidebar-option .v-icon {
        margin: 0 !important;
      }
    }
  }

  .sidebar-toggle {
    position: absolute;
    top: 16px;
    right: -14px;
    z-index: 25;
    width: 28px !important;
    height: 28px !important;
    background: #1855d8;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
  }

  .sidebar-brand {
    text-align: center;
  }

  .sidebar-brand__icon {
    width: 66px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    border-radius: 18px;
    background: linear-gradient(145deg, #2563eb, #144bd3);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.32);
    transition: 0.25s ease;
  }

  .sidebar-brand__title {
    font-size: 1.2rem;
    font-weight: 900;
  }

  .sidebar-brand__subtitle {
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.73rem;
  }

  .sidebar-option {
    display: flex;
    align-items: center;
    margin-top: 32px;
    padding: 14px;
    border-radius: 13px;
    cursor: pointer;
    transition: 0.2s ease;

    &--active {
      background: linear-gradient(135deg, #1855d8, #0f45bd);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.14);
    }
  }

  .sidebar-option__title {
    font-size: 0.88rem;
    font-weight: 800;
  }

  .sidebar-option__description {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.66rem;
  }

  .sidebar-status {
    margin-top: auto;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
  }

  .sidebar-status__label,
  .sidebar-status__date {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.68rem;
  }

  .sidebar-status__value {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 0.76rem;
    font-weight: 800;
  }

  .sidebar-status__dot {
    width: 9px;
    height: 9px;
    margin-right: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.15);
  }

  .pos-content {
    width: calc(100% - 185px);
    margin-left: 185px;
    padding: 0 18px 24px;
    transition: width 0.25s ease, margin-left 0.25s ease;
  }

  .pos-shell--collapsed {
    .pos-content {
      width: calc(100% - 64px);
      margin-left: 64px;
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

  .sale-panel {
    min-height: 660px;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .sale-header {
    min-height: 60px;
  }

  .sale-empty {
    flex: 1;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .sale-empty__icon {
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #edf3ff;
  }

  .sale-empty__title {
    margin: 18px 0 0;
    color: #0f172a;
    font-size: 1rem;
    font-weight: 900;
  }

  .sale-empty__description {
    max-width: 230px;
    margin-top: 7px;
    color: #64748b;
    font-size: 0.76rem;
    line-height: 1.5;
  }

  .sale-items {
    flex: 1;
    max-height: 430px;
    overflow-y: auto;
    padding: 13px 0;
  }

  .sale-item {
    display: flex;
    margin-bottom: 12px;
    padding: 13px;
    border: 1px solid #e3e9f2;
    border-radius: 12px;
  }

  .sale-item__visual {
    width: 45px;
    height: 45px;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    border-radius: 10px;
    background: #eef5ff;
  }

  .sale-item__content {
    min-width: 0;
    flex: 1;
  }

  .sale-item__top,
  .sale-item__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sale-item__info {
    min-width: 0;
  }

  .sale-item__name {
    overflow: hidden;
    color: #0f172a;
    font-size: 0.78rem;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sale-item__barcode {
    margin-top: 3px;
    color: #94a3b8;
    font-size: 0.63rem;
  }

  .sale-item__bottom {
    margin-top: 10px;
  }

  .sale-item__quantity {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px;
    border: 1px solid #dce5f1;
    border-radius: 9px;
    background: #f8fafc;
  }

  .quantity-button {
    width: 25px !important;
    height: 25px !important;
    color: #1856d8 !important;
    background: #ffffff !important;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  }

  .quantity-value {
    min-width: 20px;
    color: #0f172a;
    font-size: 0.75rem;
    font-weight: 900;
    text-align: center;
  }

  .sale-item__subtotal {
    color: #1856d8;
    font-size: 0.85rem;
    font-weight: 900;
  }

  .sale-summary {
    margin-top: auto;
  }

  .sale-summary__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 0.75rem;
  }

  .sale-summary__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 900;
  }

  .sale-summary__total strong {
    color: #1856d8;
    font-size: 1.8rem;
  }

  .save-sale-btn {
    border-radius: 10px;
    text-transform: none;
    font-weight: 900;
  }

  .sale-security {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 13px;
    color: #64748b;
    font-size: 0.68rem;
  }

  .product-skeleton {
    overflow: hidden;
    border-radius: 14px;
  }

  .sidebar-overlay {
    display: none;
  }

  @media (min-width: 1264px) {
    .sale-panel {
      position: sticky;
      top: 18px;
    }
  }

  @media (max-width: 960px) {
    .pos-shell--collapsed .pos-content,
    .pos-content {
      width: 100%;
      margin-left: 0;
    }

    .pos-sidebar,
    .pos-sidebar--collapsed {
      width: 240px;
      padding: 24px 14px;
      transform: translateX(-100%);

      .sidebar-brand__icon {
        width: 66px;
        height: 66px;
        margin-bottom: 15px;
      }

      .sidebar-option {
        justify-content: flex-start;
        padding: 14px;
      }

      &.pos-sidebar--mobile-open {
        transform: translateX(0);
      }
    }

    .sidebar-toggle {
      display: none;
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
