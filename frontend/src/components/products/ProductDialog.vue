<template>
  <v-dialog
    v-model="internalDialog"
    max-width="720"
    persistent
    scrollable
  >
    <v-card class="product-dialog">
      <v-card-title class="dialog-header pa-5">
        <div class="d-flex align-center">
          <div class="dialog-icon mr-3">
            <v-icon color="primary">
              {{
                isEditing
                  ? "mdi-package-variant"
                  : "mdi-package-variant-plus"
              }}
            </v-icon>
          </div>

          <div>
            <div class="dialog-title">
              {{ isEditing ? "Editar producto" : "Nuevo producto" }}
            </div>

            <div class="dialog-subtitle">
              Completa la información del producto.
            </div>
          </div>
        </div>

        <v-spacer />

        <v-btn
          icon
          :disabled="loading"
          @click="close"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.trim="form.name"
                label="Nombre del producto"
                placeholder="Ejemplo: Coca Cola 600 ml"
                outlined
                dense
                counter="150"
                prepend-inner-icon="mdi-package-variant"
                :rules="nameRules"
                :disabled="loading"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model.trim="form.barcode"
                label="Código de barras"
                placeholder="Ejemplo: P001"
                outlined
                dense
                counter="100"
                prepend-inner-icon="mdi-barcode"
                :rules="barcodeRules"
                :disabled="loading"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.price"
                label="Precio"
                placeholder="0.00"
                type="number"
                min="0.01"
                step="0.01"
                outlined
                dense
                prefix="$"
                prepend-inner-icon="mdi-currency-usd"
                :rules="priceRules"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model.trim="form.description"
                label="Descripción"
                placeholder="Descripción opcional del producto"
                outlined
                dense
                rows="2"
                auto-grow
                counter="500"
                prepend-inner-icon="mdi-text"
                :rules="descriptionRules"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model.trim="form.imageUrl"
                label="URL de la imagen"
                placeholder="https://sitio.com/producto.png"
                outlined
                dense
                counter="1000"
                prepend-inner-icon="mdi-image-outline"
                :append-icon="
                  form.imageUrl
                    ? 'mdi-open-in-new'
                    : ''
                "
                :rules="imageRules"
                :disabled="loading"
                @click:append="openImage"
              />

              <div class="image-help">
                Utiliza una URL pública que comience con
                <strong>http://</strong> o
                <strong>https://</strong>.
              </div>
            </v-col>

            <v-col
              v-if="form.imageUrl"
              cols="12"
            >
              <div class="image-preview">
                <div class="image-preview__header">
                  <div>
                    <div class="image-preview__title">
                      Vista previa de la imagen
                    </div>

                    <div class="image-preview__description">
                      Esta imagen aparecerá en el catálogo.
                    </div>
                  </div>

                  <v-btn
                    icon
                    small
                    color="error"
                    :disabled="loading"
                    @click="removeImage"
                  >
                    <v-icon small>
                      mdi-delete-outline
                    </v-icon>
                  </v-btn>
                </div>

                <div class="image-preview__content">
                  <v-img
                    v-if="!imagePreviewError"
                    :src="form.imageUrl"
                    :alt="form.name || 'Producto'"
                    contain
                    max-height="210"
                    @error="imagePreviewError = true"
                    @load="imagePreviewError = false"
                  />

                  <div
                    v-else
                    class="image-preview__error"
                  >
                    <v-icon
                      size="48"
                      color="blue-grey lighten-2"
                    >
                      mdi-image-off-outline
                    </v-icon>

                    <span>
                      No fue posible cargar la imagen.
                    </span>

                    <small>
                      Comprueba que sea una URL pública y directa.
                    </small>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="status-card">
                <div>
                  <div class="status-title">
                    Producto activo
                  </div>

                  <div class="status-description">
                    Los productos activos pueden agregarse a una venta.
                  </div>
                </div>

                <v-switch
                  v-model="form.active"
                  color="success"
                  inset
                  hide-details
                  :disabled="loading"
                />
              </div>
            </v-col>
          </v-row>

          <v-alert
            v-if="errorMessage"
            type="error"
            text
            dense
            class="mt-4 mb-0"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-5">
        <v-spacer />

        <v-btn
          text
          :disabled="loading"
          class="cancel-button"
          @click="close"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          depressed
          :loading="loading"
          class="save-product-button"
          @click="submit"
        >
          <v-icon left>
            mdi-content-save
          </v-icon>

          {{ isEditing ? "Actualizar producto" : "Guardar producto" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const emptyForm = () => ({
  id: null,
  name: "",
  barcode: "",
  price: "",
  description: "",
  imageUrl: "",
  active: true
});

export default {
  name: "ProductDialog",

  props: {
    value: {
      type: Boolean,
      default: false
    },

    product: {
      type: Object,
      default: null
    },

    loading: {
      type: Boolean,
      default: false
    },

    errorMessage: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      formValid: false,
      form: emptyForm(),
      imagePreviewError: false,

      nameRules: [
        value => !!value || "El nombre es obligatorio",
        value =>
          (value && value.length >= 2) ||
          "El nombre debe contener al menos 2 caracteres",
        value =>
          !value ||
          value.length <= 150 ||
          "El nombre no puede superar los 150 caracteres"
      ],

      barcodeRules: [
        value => !!value || "El código es obligatorio",
        value =>
          (value && value.length >= 3) ||
          "El código debe contener al menos 3 caracteres",
        value =>
          !value ||
          value.length <= 100 ||
          "El código no puede superar los 100 caracteres"
      ],

      priceRules: [
        value =>
          (
            value !== "" &&
            value !== null &&
            value !== undefined
          ) ||
          "El precio es obligatorio",

        value =>
          Number(value) > 0 ||
          "El precio debe ser mayor que cero"
      ],

      descriptionRules: [
        value =>
          !value ||
          value.length <= 500 ||
          "La descripción no puede superar los 500 caracteres"
      ],

      imageRules: [
        value =>
          !value ||
          value.length <= 1000 ||
          "La URL no puede superar los 1000 caracteres",

        value =>
          !value ||
          /^https?:\/\/.+/i.test(value) ||
          "La URL debe comenzar con http:// o https://"
      ]
    };
  },

  computed: {
    internalDialog: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    },

    isEditing() {
      return Boolean(this.form.id);
    }
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.loadForm();
      }
    },

    product: {
      deep: true,

      handler() {
        if (this.value) {
          this.loadForm();
        }
      }
    },

    "form.imageUrl"() {
      this.imagePreviewError = false;
    }
  },

  methods: {
    loadForm() {
      if (this.product) {
        this.form = {
          id: this.product.id,
          name: this.product.name || "",
          barcode: this.product.barcode || "",
          price: Number(this.product.price || 0),
          description: this.product.description || "",
          imageUrl:
            this.product.imageUrl ||
            this.product.image_url ||
            "",
          active:
            typeof this.product.active === "boolean"
              ? this.product.active
              : true
        };
      } else {
        this.form = emptyForm();
      }

      this.imagePreviewError = false;

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation();
        }
      });
    },

    close() {
      if (this.loading) {
        return;
      }

      this.internalDialog = false;
      this.form = emptyForm();
      this.imagePreviewError = false;

      this.$emit("close");
    },

    submit() {
      const valid = this.$refs.form.validate();

      if (!valid) {
        return;
      }

      this.$emit("save", {
        id: this.form.id,
        name: this.form.name.trim(),
        barcode: this.form.barcode.trim(),
        price: Number(this.form.price),
        description: this.form.description
          ? this.form.description.trim()
          : null,
        imageUrl: this.form.imageUrl
          ? this.form.imageUrl.trim()
          : null,
        active: Boolean(this.form.active)
      });
    },

    removeImage() {
      this.form.imageUrl = "";
      this.imagePreviewError = false;
    },

    openImage() {
      if (
        this.form.imageUrl &&
        /^https?:\/\/.+/i.test(this.form.imageUrl)
      ) {
        window.open(
          this.form.imageUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.product-dialog {
  overflow: hidden;
  border-radius: 22px;
}

.dialog-header {
  background: #f8fafc;
}

.dialog-icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #eff6ff;
}

.dialog-title {
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 800;
}

.dialog-subtitle {
  margin-top: 2px;
  color: #64748b;
  font-size: 0.78rem;
}

.image-help {
  margin-top: -18px;
  color: #94a3b8;
  font-size: 0.7rem;
}

.image-preview {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.image-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 15px;
  border-bottom: 1px solid #e2e8f0;
}

.image-preview__title {
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 800;
}

.image-preview__description {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.68rem;
}

.image-preview__content {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background:
    linear-gradient(
      145deg,
      #ffffff,
      #f4f7fc
    );
}

.image-preview__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.75rem;
  text-align: center;
}

.image-preview__error small {
  color: #c0cad8;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.status-title {
  color: #0f172a;
  font-weight: 700;
}

.status-description {
  margin-top: 3px;
  color: #64748b;
  font-size: 0.78rem;
}

.cancel-button,
.save-product-button {
  border-radius: 10px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}
</style>