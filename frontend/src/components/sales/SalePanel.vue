<template>
  <section class="panel-card sale-panel">
    <div class="sale-header">
      <div class="sale-header__identity">
        <div class="sale-header__icon">
          <v-icon color="primary">mdi-cart-outline</v-icon>
        </div>

        <div>
          <h2 class="sale-header__title">Venta actual</h2>

          <p class="sale-header__description">
            {{ totalUnits }} unidad(es) agregada(s)
          </p>
        </div>
      </div>

      <v-btn
        icon
        color="error"
        :disabled="items.length === 0 || saving"
        @click="$emit('clear')"
      >
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </div>

    <v-divider />

    <div v-if="items.length === 0" class="sale-empty">
      <div class="sale-empty__icon">
        <v-icon color="primary" size="64">mdi-cart-arrow-down</v-icon>
      </div>

      <h3 class="sale-empty__title">Venta vacía</h3>

      <p class="sale-empty__description">
        Selecciona productos del catálogo para agregarlos a la venta.
      </p>
    </div>

    <div v-else class="sale-items">
      <article
        v-for="(item, index) in items"
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
            @error="$emit('image-error', index)"
          />

          <v-icon v-else color="primary">mdi-package-variant</v-icon>
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
              :disabled="saving"
              @click="$emit('remove', index)"
            >
              <v-icon small>mdi-delete-outline</v-icon>
            </v-btn>
          </div>

          <div class="sale-item__bottom">
            <div class="sale-item__quantity">
              <v-btn
                icon
                x-small
                class="quantity-button"
                :disabled="saving"
                @click="$emit('decrease', index)"
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
                :disabled="saving"
                @click="$emit('increase', item)"
              >
                <v-icon size="16">mdi-plus</v-icon>
              </v-btn>
            </div>

            <div class="sale-item__pricing">
              <v-text-field
                :value="item.price"
                type="number"
                min="0.01"
                step="0.01"
                dense
                outlined
                hide-details
                prefix="$"
                class="sale-item__price-input"
                :disabled="saving"
                @input="updatePrice(index, $event)"
                @blur="$emit('validate-price', item)"
              />

              <div class="sale-item__subtotal">
                {{ formatCurrency(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="sale-summary">
      <v-divider class="mb-5" />

      <div class="sale-summary__row">
        <span>Productos diferentes</span>
        <strong>{{ items.length }}</strong>
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
        :disabled="items.length === 0"
        :loading="saving"
        @click="$emit('save')"
      >
        <v-icon left>mdi-content-save-outline</v-icon>
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
</template>

<script>
export default {
  name: "SalePanel",

  props: {
    items: {
      type: Array,
      default: () => []
    },

    total: {
      type: Number,
      default: 0
    },

    totalUnits: {
      type: Number,
      default: 0
    },

    saving: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    updatePrice(index, value) {
      this.$emit("update-price", {
        index,
        value
      });
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
.panel-card {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 19px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.sale-panel {
  min-height: 660px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sale-header {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sale-header__identity {
  display: flex;
  align-items: center;
}

.sale-header__icon {
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

.sale-header__title {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
}

.sale-header__description {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 0.72rem;
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
  overflow: hidden;
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

.sale-item__pricing {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sale-item__price-input {
  width: 112px;
  max-width: 112px;
}

.sale-item__subtotal {
  min-width: 64px;
  color: #1856d8;
  font-size: 0.85rem;
  font-weight: 900;
  text-align: right;
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

@media (min-width: 1264px) {
  .sale-panel {
    position: sticky;
    top: 18px;
  }
}
</style>
