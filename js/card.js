'use strict';

function Card(id, name) {
  var self = this;

  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('card-template', { description: this.name }, 'li');

  this.element.querySelector('.card').addEventListener('click', function (event) {
      event.stopPropagation();

      if (event.target.classList.contains('btn-delete')) {
        self.removeCard();
      }
      if (event.target.classList.contains('change-card-name')) {
        var newCardName = prompt("Enter the new description");
        self.changeCardName(newCardName);
      }

    });
};

Card.prototype = {
    removeCard: function() {
      var self = this;

      fetch(prefix + baseUrl + '/card/' + self.id, { method: 'DELETE', headers: myHeaders })
        .then(function(resp) {
          return resp.json();
        })
        .then(function(resp) {
          self.element.parentNode.removeChild(self.element);
        })
    },
    changeCardName: function(newName) {
      var self = this;
      var data = new FormData();
      data.append('id', self.id);
      data.append('name', newName);

      fetch(prefix + baseUrl + '/card/' + self.id, {
          method: 'PUT',
          headers: myHeaders,
          body: data,
        })
        .then(function(res) {
          return res.json();
        })
        .then(function(resp) {
          console.log(self.element); 
          self.name = newName;
          self.element.querySelector('.card-description').innerText = newName;
        });
    }
};
