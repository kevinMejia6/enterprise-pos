<template>
  <v-dialog
    v-model="internalDialog"
    max-width="760"
    scrollable
  >
    <v-card class="sale-detail-dialog">
      <v-card-title class="dialog-header">
        <div class="dialog-header__identity">
          <div class="dialog-header__icon">
            <v-icon color="primary">
              mdi-receipt-text-outline
            </v-icon>
          </div>

          <div>
            <div class="dialog-header__title">
              Detalle de venta
            </div>

            <div class="dialog-header__subtitle">
              {{ sale ? sale.saleNumber : "" }}
            </div>
          </div>
        </div>

        <v-spacer />

        <v-btn
          icon
          :disabled="loading"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <div
          v-if="loading"
          class="detail-loading"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="44"
          />
        </div>

        <template v-else-if="sale">
          <div class="sale-information">
            <div class="information-card">
              <span>Número de venta</span>
              <strong>{{ sale.saleNumber }}</strong>
            </div>

            <div class="information-card">
              <span>Fecha</span>
              <strong>{{ formatDate(sale.createdAt) }}</strong>
            </div>

            <div class="information-card">
              <span>Unidades</span>
              <strong>{{ sale.totalItems }}</strong>
            </div>

            <div class="information-card">
              <span>Estado</span>

              <v-chip
                small
                :color="
                  sale.status === 'COMPLETED'
                    ? 'success'
                    : 'error'
                "
                text-color="white"
              >
                {{ translateStatus(sale.status) }}
              </v-chip>
            </div>
          </div>

          <div class="detail-title">
            Productos vendidos
          </div>

          <div class="detail-products">
            <article
              v-for="detail in sale.details || []"
              :key="detail.id"
              class="detail-product"
            >
              <div class="detail-product__icon">
                <v-icon color="primary">
                  mdi-package-variant
                </v-icon>
              </div>

              <div class="detail-product__information">
                <div class="detail-product__name">
                  {{ detail.productName }}
                </div>

                <div class="detail-product__barcode">
                  Código: {{ detail.barcode }}
                </div>

                <div class="detail-product__calculation">
                  {{ detail.quantity }}
                  ×
                  {{ formatCurrency(detail.unitPrice) }}
                </div>
              </div>

              <div class="detail-product__subtotal">
                {{ formatCurrency(detail.subtotal) }}
              </div>
            </article>
          </div>

          <div class="detail-summary">
            <div class="detail-summary__row">
              <span>Subtotal</span>
              <strong>{{ formatCurrency(sale.subtotal) }}</strong>
            </div>

            <v-divider class="my-4" />

            <div class="detail-summary__total">
              <span>Total</span>
              <strong>{{ formatCurrency(sale.total) }}</strong>
            </div>
          </div>
        </template>

        <v-alert
          v-else
          type="error"
          text
        >
          No fue posible cargar el detalle de la venta.
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn
          color="primary"
          depressed
          class="close-button"
          @click="close"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SaleDetailDialog",

  props: {
    value: {
      type: Boolean,
      default: false
    },

    sale: {
      type: Object,
      default: null
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    internalDialog: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    close() {
      this.internalDialog = false;
      this.$emit("close");
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(Number(value || 0));
    },

    formatDate(value) {
      if (!value) {
        return "Sin fecha";
      }

      return new Intl.DateTimeFormat("es-SV", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(value));
    },

    translateStatus(status) {
      return status === "COMPLETED"
        ? "Completada"
        : "Cancelada";
    }
  }
};
</script>

<style scoped lang="scss">
.sale-detail-dialog {
  overflow: hidden;
  border-radius: 20px;
}

.dialog-header {
  padding: 20px;
  background: #f8fafc;
}

.dialog-header__identity {
  display: flex;
  align-items: center;
}

.dialog-header__icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 13px;
  border-radius: 14px;
  background: #eaf2ff;
}

.dialog-header__title {
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 900;
}

.dialog-header__subtitle {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.72rem;
}

.detail-loading {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sale-information {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.information-card {
  min-height: 82px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  background: #f8fafc;
}

.information-card span {
  color: #94a3b8;
  font-size: 0.65rem;
}

.information-card strong {
  margin-top: 6px;
  color: #0f172a;
  font-size: 0.8rem;
}

.detail-title {
  margin: 25px 0 12px;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 900;
}

.detail-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-product {
  display: flex;
  align-items: center;
  padding: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.detail-product__icon {
  width: 45px;
  height: 45px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 11px;
  background: #eef5ff;
}

.detail-product__information {
  min-width: 0;
  flex: 1;
}

.detail-product__name {
  color: #0f172a;
  font-size: 0.78rem;
  font-weight: 800;
}

.detail-product__barcode,
.detail-product__calculation {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.67rem;
}

.detail-product__subtotal {
  color: #1856d8;
  font-size: 0.88rem;
  font-weight: 900;
}

.detail-summary {
  margin-top: 22px;
  padding: 17px;
  border-radius: 14px;
  background: #f8fafc;
}

.detail-summary__row,
.detail-summary__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-summary__row {
  color: #64748b;
  font-size: 0.78rem;
}

.detail-summary__total {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

.detail-summary__total strong {
  color: #1856d8;
  font-size: 1.45rem;
}

.close-button {
  min-width: 110px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 800;
}

@media (max-width: 700px) {
  .sale-information {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>