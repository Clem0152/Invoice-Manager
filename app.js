function invoiceNumber (length) {
  const numbers = []

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * (91 - 65)) + 65
    numbers.push(String.fromCharCode(randomNumber))
  }

  return numbers.join('')
}

const app = Vue.createApp({
    data: function () {
        return {
              invoices: invoices,
              status: '',
              create:
                {
                  number: invoiceNumber(6),
                  client: '',
                  amount: '',
                  status: ''
                },
                newInv: false,
        }
    },
    created: function () {
      const savedData = localStorage.getItem('savedData')
      if (savedData) {
        this.invoices = JSON.parse(savedData)
      } else {
        this.invoices = invoices
      }
    },
    computed: {
      filteredInvoices: function () {
        if (this.status && this.status != 'select') {
          return this.invoices.filter(invoice => invoice.status === this.status)
        } else {
        return this.invoices
        }
      }
    },
    methods: {
      updateInvoice: function (number, client, amount, status) {
        const invoice = this.invoices.find(invoice => invoice.number === number)
        invoice.client = client,
        invoice.amount = amount,
        invoice.status = status
        return invoice
      },
      deleteInvoice: function (number) {
        const invoice = this.invoices.findIndex(invoice => invoice.number === number)
        this.invoices.splice(invoice, 1)
      },
      addInvoice: function () {
        this.invoices.push(this.create),
        this.newInv = false
      }
    },
    watch: {
      invoices: {
        deep: true,
        handler: function () {
          localStorage.setItem('savedData', JSON.stringify(this.invoices))
        }
      }
    }
})

app.component('invoice-item', {
    props: ['initialClient', 'initialNumber', 'initialAmount', 'initialStatus'],
    data: function () {
        return { 
          client: this.initialClient,
          number: this.initialNumber,
          amount: this.initialAmount,
          status: this.initialStatus,
          isPaid: this.initialStatus === 'Paid',
          isDraft: this.initialStatus === 'Draft',
          isPending: this.initialStatus === "Pending",
          update: false
        }
    },
    methods: {
      submitUpdate: function () {
        return this.update = false
      }
    },
    template: `
        <div class="invoice">
          <p class="invItem"><strong>#{{ number }}</strong></p>
          <p class="invItem">{{ client }}</p>
          <p class="invItem">&#36{{ amount }}</p>
          <div class="status invItem" v-bind:class="{ paid: isPaid, draft: isDraft, pending: isPending }">{{ status }}</div>
          <div class="invItem edit" v-on:click="update = !update">&#9998</div>
        </div>
        <div class="update" v-if="update === true">
          <form class="edit" @change="$emit('update-invoice', number, client, amount, status)">
            <input type="text" v-model="client">
            &#36<input type="number" v-model="amount">
            <select v-model="status">
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            <button class="button" type="submit" v-on:click="submitUpdate">Submit</button>
          </form>
        </div>
        `
})

app.mount('#app')