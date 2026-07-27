

// Este archivo contiene la configuración de la instancia de Axios para realizar solicitudes HTTP a la API del backend. Se establece una URL base, un tiempo de espera

<template>
  <v-card
    outlined
    class="product-card pa-4"
    :class="{ 'product-card--disabled': !product.active }"
  >
    <div class="d-flex justify-space-between align-start">
      <v-avatar
        color="blue lighten-5"
        size="48"
      >
        <v-icon color="primary">
          mdi-package-variant-closed
        </v-icon>
      </v-avatar>

      <v-chip
        small
        :color="product.active ? 'success' : 'grey'"
        text-color="white"
      >
        {{ product.active ? "Disponible" : "Inactivo" }}
      </v-chip>
    </div>

    <div class="mt-4">
      <div class="product-name">
        {{ product.name }}
      </div>

      <div class="product-code mt-1">
        Código: {{ product.barcode }}
      </div>

      <div
        v-if="product.description"
        class="product-description mt-2"
      >
        {{ product.description }}
      </div>
    </div>

    <div class="d-flex align-center justify-space-between mt-5">
      <div class="product-price">
        {{ formatCurrency(product.price) }}
      </div>

      <v-btn
        color="primary"
        small
        depressed
        :disabled="!product.active"
        @click="$emit('add', product)"
      >
        <v-icon left small>
          mdi-cart-plus
        </v-icon>

        Agregar
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",

  props: {
    product: {
      type: Object,
      required: true
    }
  },

  methods: {
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
.product-card {
  height: 100%;
  border-radius: 16px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
  }

  &--disabled {
    opacity: 0.7;
  }
}

.product-name {
  min-height: 48px;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
}

.product-code {
  color: #64748b;
  font-size: 0.75rem;
}

.product-description {
  min-height: 40px;
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.4;
}

.product-price {
  color: #1e40af;
  font-size: 1.25rem;
  font-weight: 800;
}
</style>