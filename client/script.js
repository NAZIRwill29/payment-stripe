const button = $("button")
const item1 = $("#item1")
const item2 = $("#item2")
const form = $('form')
form.submit(function(e) {
    console.log(item1.val())
    fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: item1.val() },
        { id: 2, quantity: item2.val() },
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
    e.preventDefault();
});