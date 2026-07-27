
// Este archivo contiene la configuración de la instancia de Axios para realizar solicitudes HTTP a la API del backend. Se establece una URL base, un tiempo de espera

<template>
  <v-text-field
    :value="value"
    outlined
    dense
    clearable
    hide-details
    prepend-inner-icon="mdi-magnify"
    label="Buscar producto"
    placeholder="Nombre o código de barras"
    class="product-search"
    @input="$emit('input', $event || '')"
    @click:clear="$emit('input', '')"
  />
</template>

<script>
export default {
  name: "ProductSearch",

  props: {
    value: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.product-search {
  width: 100%;
}
</style>