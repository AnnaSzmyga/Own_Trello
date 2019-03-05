'use strict';

function Column(id, name) {
  var self = this;
  
  this.id = id;
  this.name = name || 'No name given';
  this.element = generateTemplate('column-template', { name: this.name, id: this.id });

  this.element.querySelector('.column').addEventListener('click', function (event) {
      if (event.target.classList.contains('btn-delete')) {
        self.removeColumn();
      }

      if (event.target.classList.contains('add-card')) {
        var cardName = prompt("Enter the description of the card");
        event.preventDefault();

        var data = new FormData();
        data.append('name', cardName);
        data.append('bootcamp_kanban_column_id', self.id);

        fetch(prefix + baseUrl + '/card', {
            method: 'POST',
            headers: myHeaders,
            body: data,
          })
          .then(function(res) {
            return res.json();
          })
          .then(function(resp) {
            var card = new Card(resp.id, cardName);
            self.addCard(card);
          });
      }
      if (event.target.classList.contains('change-column-name')) {
        var newColumnName = prompt("Enter the name of the column");
        self.changeColumnName(newColumnName);
      }
  });
  this.element.classList.add('column-box');
};

Column.prototype = {
    addCard: function(card) {
      this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function() {
      var self = this;
      fetch(prefix + baseUrl + '/column/' + self.id, { method: 'DELETE', headers: myHeaders })
        .then(function(resp) {
          return resp.json();
        })
        .then(function(resp) {
          self.element.parentNode.removeChild(self.element);
        });
    },
    changeColumnName: function(newName) {
      var self = this;
      var data = new FormData();
      data.append('id', self.id);
      data.append('name', newName);

      fetch(prefix + baseUrl + '/column/' + self.id, {
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
          self.element.querySelector('.column-title').innerText = newName;
        });
    }

};
