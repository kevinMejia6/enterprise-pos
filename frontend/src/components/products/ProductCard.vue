<template>
  <article
    class="product-card"
    :class="{
      'product-card--inactive': !product.active
    }"
  >
    <div class="product-card__visual">
      <v-img
        v-if="productImage && !imageError"
        :src="productImage"
        :alt="product.name"
        contain
        height="155"
        class="product-card__image"
        @error="imageError = true"
        @load="imageError = false"
      />

      <div
        v-else
        class="product-card__fallback"
      >
        <div class="product-card__fallback-circle">
          <v-icon
            size="54"
            color="primary"
          >
            mdi-package-variant-closed
          </v-icon>
        </div>
      </div>

      <v-chip
        class="product-card__status"
        :color="product.active ? 'success' : 'grey'"
        text-color="white"
        x-small
      >
        {{ product.active ? "Activo" : "Inactivo" }}
      </v-chip>
    </div>

    <div class="product-card__body">
      <div class="product-card__name">
        {{ product.name }}
      </div>

      <div class="product-card__barcode">
        Código: {{ product.barcode }}
      </div>

      <div class="product-card__price">
        {{ formatCurrency(product.price) }}
      </div>
    </div>

    <div class="product-card__actions">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="product-action product-action--edit"
            v-bind="attrs"
            v-on="on"
            @click="$emit('edit', product)"
          >
            <v-icon size="18">
              mdi-pencil-outline
            </v-icon>
          </v-btn>
        </template>

        <span>Editar producto</span>
      </v-tooltip>

      <v-btn
        color="primary"
        depressed
        class="product-card__add-button"
        :disabled="!product.active"
        @click="$emit('add', product)"
      >
        <v-icon
          left
          size="18"
        >
          mdi-plus
        </v-icon>

        Agregar
      </v-btn>
    </div>
  </article>
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

  data() {
    return {
      imageError: false
    };
  },

  computed: {
    productImage() {
      return (
        this.product.imageUrl ||
        this.product.image_url ||
        ""
      );
    }
  },

  watch: {
    productImage() {
      this.imageError = false;
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
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  box-shadow:
    0 2px 5px rgba(15, 23, 42, 0.03),
    0 8px 20px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(37, 99, 235, 0.35);
    box-shadow:
      0 10px 24px rgba(15, 23, 42, 0.08),
      0 16px 34px rgba(37, 99, 235, 0.1);
  }

  &--inactive {
    opacity: 0.67;
  }
}

.product-card__visual {
  position: relative;
  height: 165px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 10px;
  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f8fafc
    );
}

.product-card__image {
  width: 100%;
  transition: transform 0.25s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.04);
}

.product-card__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__fallback-circle {
  width: 92px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background:
    linear-gradient(
      145deg,
      #eff6ff,
      #dbeafe
    );
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.12);
}

.product-card__status {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  font-weight: 700;
}

.product-card__body {
  padding: 4px 13px 10px;
}

.product-card__name {
  min-height: 40px;
  overflow: hidden;
  color: #0f172a;
  font-size: 0.83rem;
  font-weight: 800;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card__barcode {
  margin-top: 5px;
  overflow: hidden;
  color: #64748b;
  font-size: 0.68rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__price {
  margin-top: 8px;
  color: #155bd7;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.product-card__actions {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px 13px;
}

.product-action {
  width: 38px !important;
  height: 38px !important;
  flex: 0 0 auto;
  border-radius: 9px !important;

  &--edit {
    color: #2563eb !important;
    background: #eff6ff !important;
  }
}

.product-card__add-button {
  height: 38px !important;
  flex: 1;
  border-radius: 9px !important;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}
</style>