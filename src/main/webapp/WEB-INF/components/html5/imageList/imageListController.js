({
  doInit: function(component, event, helper) {

  },
  
  handleAddImage: function(component, event, helper) {
    var photo = event.getParams();
    console.warn("imageListController.handleAddImage: ", photo);

    var list = component.find("list").getElement();
    
    var img = document.createElement("img");
    var item = document.createElement("li");
    item.appendChild(img);
    img.onload = function() {
      //list.appendChild(item);
      list.insertBefore(item, list.childNodes[0]);
    }
    img.src = photo.dataURL;
  }
})