<template>
  <v-snackbar
    v-model="internalValue"
    :color="color"
    :timeout="timeout"
    top
    right
    elevation="12"
  >
    <div class="d-flex align-center">
      <v-icon
        color="white"
        class="mr-3"
      >
        {{ icon }}
      </v-icon>

      <span class="font-weight-medium">
        {{ message }}
      </span>
    </div>

    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        color="white"
        v-bind="attrs"
        @click="internalValue = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "AppSnackbar",

  props: {
    value: {
      type: Boolean,
      default: false
    },

    message: {
      type: String,
      default: ""
    },

    color: {
      type: String,
      default: "success"
    },

    timeout: {
      type: Number,
      default: 3500
    }
  },

  computed: {
    internalValue: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    },

    icon() {
      const icons = {
        success: "mdi-check-circle",
        error: "mdi-alert-circle",
        warning: "mdi-alert",
        info: "mdi-information"
      };

      return icons[this.color] || icons.info;
    }
  }
};
</script>