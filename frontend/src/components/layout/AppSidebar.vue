<template>
  <aside
    class="app-sidebar"
    :class="{
      'app-sidebar--collapsed': collapsed,
      'app-sidebar--mobile-open': mobileOpen
    }"
  >
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sidebar-brand__logo">
          <v-icon color="#2563eb" size="24">
            mdi-cart-outline
          </v-icon>
        </div>

        <div
          v-if="!collapsed"
          class="sidebar-brand__title"
        >
          Enterprise POS
        </div>
      </div>

      <v-btn
        icon
        class="sidebar-toggle"
        @click="$emit('toggle')"
      >
        <v-icon color="white" size="18">
          {{
            collapsed
              ? "mdi-chevron-right"
              : "mdi-chevron-left"
          }}
        </v-icon>
      </v-btn>
    </div>

    <div class="sidebar-divider" />

    <nav class="sidebar-navigation">
      <div
        v-if="!collapsed"
        class="sidebar-section-title"
      >
        Navegación
      </div>

      <button
        type="button"
        class="sidebar-option"
        :class="{
          'sidebar-option--active':
            isCurrentRoute('/pos')
        }"
        :title="collapsed ? 'Punto de venta' : ''"
        @click="goTo('/pos')"
      >
        <span class="sidebar-option__icon">
          <v-icon size="21">
            mdi-home-outline
          </v-icon>
        </span>

        <span
          v-if="!collapsed"
          class="sidebar-option__text"
        >
          Punto de venta
        </span>
      </button>

      <button
        type="button"
        class="sidebar-option"
        :class="{
          'sidebar-option--active':
            isCurrentRoute('/ventas')
        }"
        :title="
          collapsed
            ? 'Historial de ventas'
            : ''
        "
        @click="goTo('/ventas')"
      >
        <span class="sidebar-option__icon">
          <v-icon size="21">
            mdi-receipt-text-clock-outline
          </v-icon>
        </span>

        <span
          v-if="!collapsed"
          class="sidebar-option__text"
        >
          Historial de ventas
        </span>
      </button>
    </nav>

    <div class="sidebar-divider sidebar-divider--secondary" />

    <section class="sidebar-system">
      <div
        v-if="!collapsed"
        class="sidebar-section-title"
      >
        Sistema
      </div>

      <div
        class="system-option"
        :title="
          collapsed
            ? 'Sistema operativo'
            : ''
        "
      >
        <span class="system-option__icon">
          <span class="system-option__dot" />
        </span>

        <span
          v-if="!collapsed"
          class="system-option__content"
        >
          <span class="system-option__title">
            Estado del sistema
          </span>

          <span class="system-option__description">
            Conexión activa
          </span>
        </span>
      </div>
    </section>

    <div class="sidebar-footer">
      <div
        class="sidebar-date"
        :class="{
          'sidebar-date--collapsed': collapsed
        }"
      >
        <v-icon
          size="17"
          class="sidebar-date__icon"
        >
          mdi-clock-outline
        </v-icon>

        <span v-if="!collapsed">
          {{ currentDate }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "AppSidebar",

  props: {
    collapsed: {
      type: Boolean,
      default: false
    },

    mobileOpen: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    currentRoute() {
      return this.$route.path;
    },

    currentDate() {
      return new Intl.DateTimeFormat("es-SV", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date());
    }
  },

  methods: {
    isCurrentRoute(path) {
      return this.currentRoute === path;
    },

    goTo(path) {
      this.$emit("close-mobile");

      if (this.currentRoute !== path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.app-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  width: 220px;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  color: #0f172a;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  box-shadow: 6px 0 20px rgba(15, 23, 42, 0.05);
  transition:
    width 0.25s ease,
    padding 0.25s ease,
    transform 0.25s ease;

  &--collapsed {
    width: 72px;
    padding: 16px 9px;

    .sidebar-header {
      justify-content: center;
    }

    .sidebar-brand {
      justify-content: center;
    }

    .sidebar-brand__logo {
      width: 30px;
      height: 30px;
      margin: 0;
    }

    .sidebar-navigation {
      gap: 8px;
    }

    .sidebar-option,
    .system-option {
      justify-content: center;
      padding: 9px;
    }

    .sidebar-option__icon,
    .system-option__icon {
      margin: 0;
    }

    .sidebar-divider {
      margin: 15px 3px;
    }

    .sidebar-footer {
      padding: 0;
    }
  }
}

.sidebar-header {
  position: relative;
  min-height: 46px;
  display: flex;
  align-items: center;
}

.sidebar-brand {
  min-width: 0;
  display: flex;
  align-items: center;
}

.sidebar-brand__logo {
  width: 30px;
  height: 30px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background: transparent;
}

.sidebar-brand__title {
  overflow: hidden;
  color: #111827;
  font-size: 0.9rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-toggle {
  position: absolute;
  top: 8px;
  right: -27px;
  z-index: 25;
  width: 28px !important;
  height: 28px !important;
  border: 3px solid #f4f7fc;
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
}

.sidebar-divider {
  height: 1px;
  margin: 16px 5px;
  background: #e5e7eb;

  &--secondary {
    margin-top: 18px;
    margin-bottom: 16px;
  }
}

.sidebar-section-title {
  margin: 0 10px 9px;
  color: #94a3b8;
  font-size: 0.64rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.sidebar-navigation {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-option {
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border: none;
  border-radius: 9px;
  outline: none;
  color: #64748b;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  .v-icon {
    color: #64748b !important;
    transition: color 0.18s ease;
  }

  &:hover {
    color: #2563eb;
    background: #eff6ff;

    .v-icon {
      color: #2563eb !important;
    }
  }

  &--active {
    color: #ffffff;
    background: #2563eb;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.18);

    .v-icon {
      color: #ffffff !important;
    }
  }

  &--active:hover {
    color: #ffffff;
    background: #2563eb;

    .v-icon {
      color: #ffffff !important;
    }
  }
}

.sidebar-option__icon {
  width: 30px;
  height: 30px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 9px;
}

.sidebar-option__text {
  min-width: 0;
  overflow: hidden;
  flex: 1;
  color: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-system {
  display: flex;
  flex-direction: column;
}

.system-option {
  min-height: 46px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 9px;
  color: #475569;
}

.system-option__icon {
  width: 30px;
  height: 30px;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-right: 9px;
  border-radius: 8px;
  background: #dcfce7;
}

.system-option__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.system-option__content {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.system-option__title {
  overflow: hidden;
  color: #111827;
  font-size: 0.75rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.system-option__description {
  overflow: hidden;
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.63rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 4px;
}

.sidebar-date {
  display: flex;
  align-items: center;
  padding: 9px 8px;
  border-top: 1px solid #e5e7eb;
  color: #94a3b8;
  font-size: 0.62rem;

  &--collapsed {
    justify-content: center;
    padding: 10px 0;
  }
}

.sidebar-date__icon {
  flex: 0 0 auto;
  margin-right: 7px;
  color: #64748b !important;
}

.sidebar-date--collapsed {
  .sidebar-date__icon {
    margin-right: 0;
  }
}

@media (max-width: 960px) {
  .app-sidebar,
  .app-sidebar--collapsed {
    width: 250px;
    padding: 18px 14px;
    transform: translateX(-100%);

    &.app-sidebar--mobile-open {
      transform: translateX(0);
    }

    .sidebar-header {
      justify-content: flex-start;
    }

    .sidebar-brand {
      justify-content: flex-start;
    }

    .sidebar-brand__logo {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }

    .sidebar-option,
    .system-option {
      justify-content: flex-start;
      padding: 8px 10px;
    }

    .sidebar-option__icon,
    .system-option__icon {
      margin-right: 9px;
    }
  }

  .sidebar-toggle {
    display: none;
  }
}
</style>
