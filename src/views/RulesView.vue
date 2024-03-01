<template>
  <v-container id="rules-content" fluid class="pa-4 pa-sm-6 pa-md-8">
    <div class="d-flex justify-space-between">
      <h1 class="text-h3">Правила игры</h1>
    </div>

    <h2 id="Характеристики_игрока" class="text-h4">Характеристики игрока</h2>
    <h3 id="ХП" class="text-h5">ХП</h3>
    <p>Текущее здоровье игрока, максимум 2хп.</p>
    <h3 id="Бомбы" class="text-h5">Бомбы</h3>
    <p>
      Бомбы - расходуемый предмет. В начале игры у каждого игрока 3шт. Пополняются при входе в
      Арсенал. Используется для разрушения стен (только разрушимые стены реагируют).
    </p>
    <h3 id="Стрелы" class="text-h5">Стрелы</h3>
    <p>
      Стрелы - расходуемый предмет. В начале игры у каждого игрока 3шт. Пополняются при входе в
      Арсенал. Используется для нанесения урона соперникам. Летит до столкновения либо с игроком,
      либо со стеной. (наносит урон всем игрокам на клетке).
    </p>
    <h3 id="Рюкзак_для_клада" class="text-h5">Рюкзак для клада</h3>
    <p>
      Рюкзак для клада - Позволяет игроку подбирать клад. Вмещает только один клад. Если игрок
      теряет более половины ХП, ему становится тяжело передвигаться, поэтому клад выпадает.
    </p>

    <h2 id="Игровое_поле" class="text-h4">Игровое поле</h2>
    <h3 id="Виды_клеток" class="text-h5">Виды клеток</h3>
    <ul>
      <li>Суша - самая обычная клетка суши. На ней может находиться один из типов домов.</li>
      <li>
        Река - при попадании в реку игрока смывает на 2 клетки, либо в устье. В случае если игрок
        движется вдоль течения реки, игрока не сносит течением. В случае пропуска хода игроком,
        находящемся в реке, его смоет на одну клетку.
      </li>
      <li>Устье - конец реки.</li>
      <li>
        Выход (клетка) - клетка за пределами лабиринта. Если у игрока был клад, то клад исчезнет и в
        случае, если клад был истинным, то игрок побеждает.
      </li>
    </ul>
    <h3 id="Виды_стен" class="text-h5">Виды стен</h3>
    <ul>
      <li>Внешняя стена - является неразрушимой. При столкновении с игроком не пропускает его.</li>
      <li>Бетонная стена - является разрушимой. При столкновении с игроком не пропускает его.</li>
      <li>Выход - является неразрушимой. Является выходом из лабиринта.</li>
    </ul>
    <h3 id="Виды_домов" class="text-h5">Виды домов</h3>
    <ul>
      <li>Арсенал - восполняет запас бомб и стрел.</li>
      <li>Склад бомб - восполняет запас бомб.</li>
      <li>Склад стрел - восполняет запас стрел.</li>
      <li>Медпункт - восполняет здоровье игрока.</li>
    </ul>
    <h2 id="Предметы" class="text-h4">Предметы</h2>
    <p>Предметы появляются на карте при генерации.</p>
    <ul>
      <li>Истинный клад - настоящий клад, игрок вынесший его из лабиринта побеждает.</li>
      <li>
        Ложный клад - клад-ловушка. Выглядит как настоящий, однако, не приводит к победе при
        покидании лабиринта.
      </li>
    </ul>
    <h2 id="Управление" class="text-h4">Управление</h2>
    <h3 id="Виды_действий_игроков" class="text-h5">Виды действий игроков</h3>
    <ul>
      <li>Пропуск хода - доступен всегда.</li>
      <li>
        Подобрать клад - доступно, если на клетке под игроком лежит клад, а также здоровье игрока
        больше половины от максимального.
      </li>
    </ul>
    <h3 id="Виды_направленных_действий" class="text-h5">Виды направленных действий</h3>
    <ul>
      <li>Движение - игрок ходит в указанном направлении</li>
      <li>Выстрел из лука - игрок стреляет из лука в указанном направлении.</li>
      <li>Бросить бомбу - игрок устанавливает бомбу на указанную сторону текущей клетки.</li>
    </ul>
    <v-layout-item
      class="text-end pointer-events-none"
      position="bottom"
      size="88"
      model-value
      v-scroll="onScroll"
    >
      <div class="ma-4">
        <v-fab-transition>
          <v-btn
            v-show="showGoTop"
            class="mt-auto pointer-events-initial"
            color="primary"
            elevation="8"
            icon="mdi-chevron-up"
            size="large"
            @click="goTo(0)"
          />
        </v-fab-transition>
      </div>
    </v-layout-item>
  </v-container>
</template>

<script>
import { useTocStore } from '@/stores/tocStore'

export default {
  setup() {
    const tocStore = useTocStore()
    return { tocStore }
  },

  data: () => ({
    showGoTop: false
  }),

  methods: {
    onScroll() {
      this.showGoTop = window.scrollY > 200
    },

    goTo(pos) {
      window.scrollTo(0, pos)
    },

    calcLevel(tagName) {
      switch (tagName) {
        case 'h2':
          return 1
        case 'h3':
          return 2
        default:
          return 1
      }
    }
  },

  unmounted() {
    this.tocStore.reset()
  },

  mounted() {
    const tocItems = document.querySelectorAll('h2, h3')
    let ancors = []
    tocItems.forEach((el) => {
      ancors.push({
        id: el.id,
        title: el.innerText,
        href: `#${el.id}`,
        level: this.calcLevel(el.localName)
      })
    })

    this.tocStore.setAncors(ancors)
  }
}
</script>

<style scoped>
h2 {
  margin-top: 16px;
  margin-bottom: 4px;
}

h3 {
  margin-top: 8px;
  margin-bottom: 4px;
}
ul {
  padding-left: 2rem;
}
</style>
