(function(){
    //We asume sea food/fish is also meat
    //According to Health Canada, calamari belongs to the meat and meat alternatives food group.
    var meats = ["ham", "cocktail_sausages", "salami", "shrimps", "mussels", "tuna", "calamari", "crab_meat", "anchovies", "minced_meat", "sausage", "kebab", "minced_beef"];
    var cheese = ["mozzarella_cheese", "mozzarella", "parmesan_cheese", "blue_cheese", "goat_cheese"];
    var olives = ["green_olives", "black_olives", "olives"];
    
    $.get("http://coding-challenge.renderedtext.com/", function (data) {
        var data = JSON.parse(data);
        
        //Filter only pizzas
        data.pizzas = data.pizzas.filter(function (item, index, array) {
            if (item.nil === undefined) return true;
        })
        
        var pizzaNo = data.pizzas.length; // No of valid (not nil pizzas)
        
        data.pizzas.forEach(function (item) {
            item.meatNo = 0;
            item.cheeseNo = 0;
            item.olivesNo = 0;
            item.hasMushrooms = false;
            item.hasMozzarella = false;
            
            item[Object.keys(item)[0]].ingredients.forEach(function (obj) {
                if ($.inArray(obj, meats) !== -1) {
                    item.meatNo++;
                } else if ($.inArray(obj, cheese) !== -1) {
                    item.cheeseNo++;
                } else if ($.inArray(obj, olives) !== -1) {
                    item.olivesNo++;
                } else if (obj === "mushrooms") {
                    item.hasMushrooms = true;
                }
                
                if (obj === "mozzarella" || obj === "mozzarella_cheese") {
                    item.hasMozzarella = true;
                }
            })
        })
        
        var meatPizzas = data.pizzas.filter(function (item, index, array) {
            if(item.meatNo > 0) return true;
        }).sort(function(a, b){
            return a.price-b.price;
        })
        
        var moreCheese = data.pizzas.filter(function (item, index, array) {
            if (item.cheeseNo > 1) return true; 
        }).sort(function (a, b) {
            return a.price - b.price;
        })

        var meatAndOlive = data.pizzas.filter(function (item, index, array) {
            if (item.meatNo > 0 && item.olivesNo > 0) return true;
        }).sort(function (a, b) {
            return a.price - b.price;
        })

        var mozzarellaAndMushrooms = data.pizzas.filter(function (item, index, array) {
            if (item.hasMushrooms && item.hasMozzarella) return true;
        }).sort(function (a, b) {
            return a.price - b.price;
        })

        deleteTempData(meatPizzas);
        deleteTempData(moreCheese);
        deleteTempData(meatAndOlive);
        deleteTempData(mozzarellaAndMushrooms);
        
        var response = {
           "personal_info":
              {"full_name":"Marko Reljic", "email":"markoreljic992@gmail.com", "code_link": "https://github.com/Relja92/rendered"},
            "answer": [{"group_1": {"percentage": meatPizzas.length/pizzaNo*100+"%", "cheapest": meatPizzas[0]}},
                       {"group_2": {"percentage": moreCheese.length/pizzaNo*100+"%", "cheapest": moreCheese[0]}},
                       {"group_3": {"percentage": meatAndOlive.length/pizzaNo*100+"%", "cheapest": meatAndOlive[0]}},
                       {"group_4": {"percentage": mozzarellaAndMushrooms.length/pizzaNo*100+"%", "cheapest":mozzarellaAndMushrooms[0]}}]
          }
        
        console.log(response);
        return response;
    })
})();


function deleteTempData (array) {
    array.every(function (item, index, array) {
        delete item.meatNo;
        delete item.hasMozzarella;
        delete item.hasMushrooms;
        delete item.olivesNo;
        delete item.cheeseNo;
    })
}
