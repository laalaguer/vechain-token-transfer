<template>
  <b-modal
    :title="bigTitle"
    :ok-title="okTitle"
    :cancel-title="cancelTitle"
    v-model="modalShow"
    centered
    hide-header-close
    @ok="handleModalOk"
    @cancel="handelModalCancel">

    <b-form-group
      label=""
      label-for="input-nickname"
      :invalid-feedback="invalidFeedback"
      :valid-feedback="validFeedback"
      :state="nicknameState"
      class="noselect"
    >
      <b-form-input
        id="input-nickname"
        :state="nicknameState"
        v-model.trim="nickname"
        placeholder="..."
      ></b-form-input>
  </b-form-group>
  </b-modal>
</template>

<script>
export default {
  props: {
    presetNickname: String
  },
  data () {
    return {
      maxCharacters: 16,
      nickname: '',
      modalShow: false
    }
  },
  methods: {
    handleModalOk: function (bvModalEvt) {
      if (this.nicknameState === true) {
        this.$emit('nicknameReady', this.nickname)
      } else if (this.nicknameState === null) {
        this.$emit('nicknameReady', '')
      } else {
        bvModalEvt.preventDefault()
      }
    },
    handelModalCancel: function () {
      this.hideMe()
    },
    clearBox () {
      this.nickname = ''
    },
    showMe () {
      this.clearBox()
      this.modalShow = true
    },
    hideMe () {
      this.clearBox()
      this.modalShow = false
    }
  },
  computed: {
    bigTitle () {
      return this.$t('nicknameModal.title')
    },

    okTitle () {
      return this.$t('nicknameModal.ok')
    },

    cancelTitle () {
      return this.$t('nicknameModal.cancel')
    },

    invalidFeedback () {
      return '16 characters max.'
    },

    validFeedback () {
      return 'Looks good.'
    },

    nicknameState () {
      if (this.nickname.length === 0) {
        return null
      }
      if (this.nickname.length > 16) {
        return false
      }
      return true
    }
  }
}
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>
