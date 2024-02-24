<template>
  <v-container v-if="showControls" class="d-flex justify-center">
    <div>
      <div class="d-flex">
        <v-btn
          @click="emitAction('skip')"
          :disabled="!(isActive && allowed_abilities['skip'])"
          rounded="0"
          icon="mdi-skip-next"
          size="large"
        >
        </v-btn>
        <v-btn @click="emitAction('top')" rounded="0" icon="mdi-arrow-up-bold" size="large">
        </v-btn>
        <v-btn
          @click="emitAction('swap_treasure')"
          :disabled="!(isActive && allowed_abilities['swap_treasure'])"
          rounded="0"
          icon="mdi-swap-vertical-bold"
          size="large"
        >
        </v-btn>
      </div>
      <div class="d-flex">
        <v-btn @click="emitAction('left')" rounded="0" icon="mdi-arrow-left-bold" size="large">
        </v-btn>
        <v-btn @click="emitAction('bottom')" rounded="0" icon="mdi-arrow-down-bold" size="large">
        </v-btn>
        <v-btn @click="emitAction('right')" rounded="0" icon="mdi-arrow-right-bold" size="large">
        </v-btn>
      </div>
    </div>
    <div>
      <v-btn-toggle
        v-model="selected_action"
        mandatory
        rounded="0"
        color="primary"
        class="flex-column h-100"
      >
        <v-btn
          :disabled="!(isActive && allowed_abilities['shoot_bow'])"
          icon="mdi-bow-arrow"
          value="shoot_bow"
          size="large"
          class="flex-grow-1"
        ></v-btn>
        <v-btn
          :disabled="!(isActive && allowed_abilities['throw_bomb'])"
          icon="mdi-bomb"
          value="throw_bomb"
          size="large"
          class="flex-grow-1"
        ></v-btn>
        <v-btn
          :disabled="!(isActive && allowed_abilities['move'])"
          icon="mdi-run"
          value="move"
          size="large"
          class="flex-grow-1"
        ></v-btn>
      </v-btn-toggle>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'game-controls-card',
  props: {
    showControls: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    allowed_abilities: {
      info: false,
      move: false,
      shoot_bow: false,
      skip: false,
      swap_treasure: false,
      throw_bomb: false
    }
  },

  data: () => ({
    default_action: 'move',
    selected_action: 'move'
  }),

  methods: {
    emitAction(action_name) {
      let action = this.selected_action
      let direction = null
      switch (action_name) {
        case 'skip':
        case 'swap_treasure':
          action = action_name
          break
        default:
          direction = action_name
      }
      this.selected_action = this.default_action
      this.$emit('action', action, direction)
    }
  }
}
</script>
