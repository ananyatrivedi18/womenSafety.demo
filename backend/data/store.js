

const store = {
  
  users: [],

  
  contacts: [],

 
  sosAlerts: [],

  
  _lastId: 0,
};


function nextId() {
  store._lastId += 1;
  return String(store._lastId);
}

module.exports = { store, nextId };
