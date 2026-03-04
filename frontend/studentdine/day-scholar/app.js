/* App core — shared across roles. Role label read from the page. */
const PAGE_ROLE = (document.querySelector(".role-pill strong")?.textContent || "Guest");

/* Restaurant data is defined in index.html */
  {"id":"royal-thali","name":"Royal Thali","type":"Indian","img":"","menu":{
    "starters":[{"n":"Aloo Tikki","d":"Crisp potato patties","p":110,"img":""},{"n":"Hara Bhara Kebab","d":"Spinach & peas kebab","p":150,"img":""},{"n":"Fish Amritsari","d":"Crisp batter fried fish","p":290,"img":""}],
    "drinks":[{"n":"Sweet Lassi","d":"Rich, creamy lassi","p":85,"img":""},{"n":"Rooh Afza","d":"Rose sharbat cooler","p":60,"img":""},{"n":"Jaljeera","d":"Tangy cumin refresher","p":55,"img":""}],
    "main":[{"n":"Paneer Butter Masala","d":"Silky makhani gravy","p":260,"img":""},{"n":"Chole Bhature","d":"Delhi style","p":180,"img":""},{"n":"Mutton Rogan Josh","d":"Kashmiri style","p":340,"img":""}]
  }},
  {"id":"spice-route","name":"Spice Route","type":"Indian","img":"","menu":{
    "starters":[{"n":"Samosa","d":"Potato peas filling","p":60,"img":""},{"n":"Paneer 65","d":"Spicy fried paneer","p":170,"img":""},{"n":"Chicken Malai Tikka","d":"Creamy marinade","p":280,"img":""}],
    "drinks":[{"n":"Nimbu Pani","d":"Fresh lime soda","p":50,"img":""},{"n":"Sugarcane Juice","d":"Pressed fresh","p":70,"img":""},{"n":"Thandai","d":"Almond saffron milk","p":120,"img":""}],
    "main":[{"n":"Biryani (Veg/Chicken)","d":"Hyderabadi style","p":250,"img":""},{"n":"Palak Paneer","d":"Spinach gravy","p":240,"img":""},{"n":"Kadhai Chicken","d":"Bell peppers, onion","p":300,"img":""}]
  }},
  /* Coffee x4 */
  {"id":"bean-bloom","name":"Bean & Bloom","type":"Coffee","img":"","menu":{
    "starters":[{"n":"Butter Croissant","d":"Flaky layers","p":90,"img":""},{"n":"Blueberry Muffin","d":"Soft, studded berries","p":110,"img":""},{"n":"Avocado Toast","d":"Sourdough, lemon, chilli","p":180,"img":""}],
    "drinks":[{"n":"Espresso","d":"Double shot","p":100,"img":""},{"n":"Cappuccino","d":"Foamy classic","p":130,"img":""},{"n":"Iced Latte","d":"Cold & smooth","p":150,"img":""}],
    "main":[{"n":"Chicken Panini","d":"Grilled, pesto","p":220,"img":""},{"n":"Veggie Wrap","d":"Hummus & veg","p":180,"img":""},{"n":"Cookie Duo","d":"Chocolate & oatmeal","p":90,"img":""}]
  }},
  {"id":"campus-caffeine","name":"Campus Caffeine","type":"Coffee","img":"","menu":{
    "starters":[{"n":"Donut","d":"Glazed ring","p":70,"img":""},{"n":"Cinnamon Roll","d":"Swirled and iced","p":120,"img":""},{"n":"Granola Yogurt","d":"Honey & nuts","p":140,"img":""}],
    "drinks":[{"n":"Americano","d":"Long black","p":110,"img":""},{"n":"Mocha","d":"Chocolate espresso","p":150,"img":""},{"n":"Cold Brew","d":"Slow steeped","p":160,"img":""}],
    "main":[{"n":"Egg Sandwich","d":"Cheese & lettuce","p":150,"img":""},{"n":"Veg Quiche","d":"Spinach & corn","p":170,"img":""},{"n":"Cupcake","d":"Vanilla/Chocolate","p":80,"img":""}]
  }},
  {"id":"java-jar","name":"Java Jar","type":"Coffee","img":"","menu":{
    "starters":[{"n":"Almond Biscotti","d":"Crunchy dunkers","p":80,"img":""},{"n":"Brownie","d":"Gooey cocoa","p":110,"img":""},{"n":"Bagel & Cream Cheese","d":"Toasted","p":130,"img":""}],
    "drinks":[{"n":"Flat White","d":"Velvety microfoam","p":140,"img":""},{"n":"Macchiato","d":"Marked shot","p":120,"img":""},{"n":"Iced Caramel Latte","d":"Sweet & chilled","p":170,"img":""}],
    "main":[{"n":"Chicken Salad Bowl","d":"Fresh & hearty","p":220,"img":""},{"n":"Protein Cookie","d":"Oats & whey","p":90,"img":""},{"n":"Mini Donuts","d":"Sugar dusted","p":85,"img":""}]
  }},
  {"id":"brew-buddy","name":"Brew Buddy","type":"Coffee","img":"","menu":{
    "starters":[{"n":"Banana Bread","d":"Moist slice","p":90,"img":""},{"n":"Chocolate Chip Cookie","d":"Crispy edges","p":70,"img":""},{"n":"Tomato Bruschetta","d":"Basil & olive oil","p":150,"img":""}],
    "drinks":[{"n":"Latte","d":"Silky milk","p":130,"img":""},{"n":"Affogato","d":"Espresso over ice-cream","p":160,"img":""},{"n":"Iced Tea","d":"Peach/lemon","p":110,"img":""}],
    "main":[{"n":"Pesto Pasta (Light)","d":"Basil & pine nuts","p":210,"img":""},{"n":"Veggie Bowl","d":"Quinoa & greens","p":190,"img":""},{"n":"Croissant Sandwich","d":"Cheese & tomato","p":170,"img":""}]
  }},
  /* Cake shop */
  {"id":"cake-corner","name":"Cake Corner","type":"Cake Shop","img":"","menu":{
    "starters":[{"n":"Tea Cake Slice","d":"Buttery slice","p":80,"img":""},{"n":"Cupcake Box (2)","d":"Frosted minis","p":120,"img":""},{"n":"Cake Pops (3)","d":"Fun bites","p":100,"img":""}],
    "drinks":[{"n":"Hot Chocolate","d":"Rich cocoa","p":140,"img":""},{"n":"Milkshake","d":"Strawberry/Choco","p":160,"img":""},{"n":"Coffee","d":"Classic brew","p":90,"img":""}],
    "main":[{"n":"Chocolate Truffle Cake","d":"Half kg","p":550,"img":""},{"n":"Red Velvet Cake","d":"Half kg","p":600,"img":""},{"n":"Fruit Gateau","d":"Half kg","p":580,"img":""}]
  }},
  /* Boulangerie */
  {"id":"levain-lab","name":"Levain Lab","type":"Boulangerie","img":"","menu":{
    "starters":[{"n":"French Baguette","d":"Crusty loaf","p":120,"img":""},{"n":"Sourdough Slice","d":"Naturally leavened","p":130,"img":""},{"n":"Focaccia","d":"Rosemary & olive","p":150,"img":""}],
    "drinks":[{"n":"Cafe au Lait","d":"Mellow milk coffee","p":120,"img":""},{"n":"Sparkling Water","d":"Refreshing","p":60,"img":""},{"n":"Lemonade","d":"Fresh squeezed","p":80,"img":""}],
    "main":[{"n":"Ham & Cheese Baguette","d":"Classic Parisian","p":240,"img":""},{"n":"Veg Paris Sandwich","d":"Tomato, lettuce, brie","p":220,"img":""},{"n":"Almond Croissant","d":"Frangipane filled","p":140,"img":""}]
  }},
  /* Patisserie */
  {"id":"eclair-atelier","name":"Éclair Atelier","type":"Patisserie","img":"","menu":{
    "starters":[{"n":"Mini Éclairs (2)","d":"Chocolate & coffee","p":140,"img":""},{"n":"Madeleines (5)","d":"Lemon shell cakes","p":120,"img":""},{"n":"Crème Brûlée","d":"Crackly top","p":180,"img":""}],
    "drinks":[{"n":"Espresso","d":"Short & bold","p":100,"img":""},{"n":"French Hot Chocolate","d":"Thick & lush","p":170,"img":""},{"n":"Tea Selection","d":"Assorted","p":110,"img":""}],
    "main":[{"n":"Mille-Feuille","d":"Custard layers","p":220,"img":""},{"n":"Opera Cake","d":"Almond & coffee","p":260,"img":""},{"n":"Tarte Tatin","d":"Caramel apple tart","p":240,"img":""}]
  }},
  /* Ramen */
  {"id":"ramen-rush","name":"Ramen Rush","type":"Ramen","img":"","menu":{
    "starters":[{"n":"Gyoza (6)","d":"Pan-fried dumplings","p":180,"img":""},{"n":"Edamame","d":"Sea salt","p":120,"img":""},{"n":"Seaweed Salad","d":"Sesame dressing","p":140,"img":""}],
    "drinks":[{"n":"Green Tea","d":"Hot or iced","p":90,"img":""},{"n":"Ramune","d":"Japanese soda","p":130,"img":""},{"n":"Miso Soup","d":"Comforting bowl","p":100,"img":""}],
    "main":[{"n":"Shoyu Ramen","d":"Soy broth, pork","p":320,"img":""},{"n":"Tonkotsu Ramen","d":"Rich pork broth","p":360,"img":""},{"n":"Veg Miso Ramen","d":"Tofu & corn","p":300,"img":""}]
  }},
  /* Tex-Mex */
  {"id":"taco-trail","name":"Taco Trail","type":"Tex-Mex","img":"","menu":{
    "starters":[{"n":"Nachos","d":"Cheese & salsa","p":180,"img":""},{"n":"Quesadilla","d":"Cheese filled","p":190,"img":""},{"n":"Chips & Guac","d":"Fresh dip","p":160,"img":""}],
    "drinks":[{"n":"Soda","d":"Assorted","p":60,"img":""},{"n":"Lime Agua Fresca","d":"Zesty & fresh","p":90,"img":""},{"n":"Iced Coffee","d":"Light roast","p":110,"img":""}],
    "main":[{"n":"Tacos (2)","d":"Choose filling","p":220,"img":""},{"n":"Burrito","d":"Stuffed & wrapped","p":260,"img":""},{"n":"Loaded Fries","d":"Cheese & jalapeño","p":200,"img":""}]
  }},
  /* Pizza x3 */
  {"id":"pizza-piazza","name":"Pizza Piazza","type":"Pizza","img":"","menu":{
    "starters":[{"n":"Garlic Bread","d":"Herb butter","p":120,"img":""},{"n":"Cheesy Sticks","d":"Mozzarella pull","p":160,"img":""},{"n":"Tomato Soup","d":"Creamy basil","p":130,"img":""}],
    "drinks":[{"n":"Soft Drink","d":"Assorted","p":60,"img":""},{"n":"Iced Lemonade","d":"Fresh","p":90,"img":""},{"n":"Iced Coffee","d":"Classic","p":110,"img":""}],
    "main":[{"n":"Margherita","d":"Tomato, basil","p":240,"img":""},{"n":"Pepperoni","d":"Spicy slices","p":290,"img":""},{"n":"Veggie Supreme","d":"Bell pepper, olive","p":270,"img":""}]
  }},
  {"id":"slice-street","name":"Slice Street","type":"Pizza","img":"","menu":{
    "starters":[{"n":"Jalapeño Poppers","d":"Cream cheese","p":170,"img":""},{"n":"BBQ Wings","d":"Sticky glaze","p":220,"img":""},{"n":"Greek Salad","d":"Feta & olive","p":180,"img":""}],
    "drinks":[{"n":"Cola/Fanta/Sprite","d":"Assorted","p":60,"img":""},{"n":"Mint Mojito","d":"Virgin","p":120,"img":""},{"n":"Bottled Water","d":"500 ml","p":30,"img":""}],
    "main":[{"n":"BBQ Chicken","d":"Onion & pepper","p":320,"img":""},{"n":"Paneer Tikka Pizza","d":"Indian twist","p":310,"img":""},{"n":"Four Cheese","d":"Cheddar, mozz, more","p":330,"img":""}]
  }},
  {"id":"la-pino-like","name":"La Pino Like","type":"Pizza","img":"","menu":{
    "starters":[{"n":"Stuffed Garlic Bread","d":"Cheesy filling","p":190,"img":""},{"n":"Corn Salad","d":"Sweet corn","p":150,"img":""},{"n":"Tomato Bruschetta","d":"Basil & garlic","p":150,"img":""}],
    "drinks":[{"n":"Iced Tea","d":"Peach/lemon","p":110,"img":""},{"n":"Soda","d":"Assorted","p":60,"img":""},{"n":"Coffee","d":"Brewed","p":90,"img":""}],
    "main":[{"n":"Peri Peri Veg","d":"Spicy kick","p":300,"img":""},{"n":"Farmhouse","d":"Loaded veggies","p":310,"img":""},{"n":"Chicken Feast","d":"Meaty & hearty","p":340,"img":""}]
  }},
  /* Fast food x4 */
  {"id":"burger-barn","name":"Burger Barn","type":"Fast Food","img":"","menu":{
    "starters":[{"n":"Fries","d":"Crispy & salted","p":90,"img":""},{"n":"Onion Rings","d":"Golden crunch","p":110,"img":""},{"n":"Cheese Corn Nuggets","d":"Molten bites","p":130,"img":""}],
    "drinks":[{"n":"Soda","d":"Assorted","p":60,"img":""},{"n":"Thick Shake","d":"Vanilla/Choco","p":160,"img":""},{"n":"Iced Coffee","d":"Brewed cold","p":120,"img":""}],
    "main":[{"n":"Veg Burger","d":"Signature sauce","p":160,"img":""},{"n":"Chicken Burger","d":"Crispy fillet","p":200,"img":""},{"n":"Paneer Wrap","d":"Spicy tikka","p":180,"img":""}]
  }},
  {"id":"fries-factory","name":"Fries Factory","type":"Fast Food","img":"","menu":{
    "starters":[{"n":"Peri Fries","d":"Spicy dusting","p":110,"img":""},{"n":"Loaded Nacho Fries","d":"Cheese & salsa","p":160,"img":""},{"n":"Cheesy Garlic Bread","d":"Pull-apart","p":150,"img":""}],
    "drinks":[{"n":"Lemon Soda","d":"Sweet/salt","p":70,"img":""},{"n":"Iced Tea","d":"Peach/lemon","p":110,"img":""},{"n":"Cold Coffee","d":"Blended","p":130,"img":""}],
    "main":[{"n":"Double Patty Burger","d":"Extra indulgent","p":240,"img":""},{"n":"Veggie Hot Dog","d":"Loaded","p":190,"img":""},{"n":"Chicken Popcorn","d":"Bite-sized","p":180,"img":""}]
  }},
  {"id":"wrap-n-roll","name":"Wrap N Roll","type":"Fast Food","img":"","menu":{
    "starters":[{"n":"Cheesy Nachos","d":"Salsa & jalapeño","p":150,"img":""},{"n":"Corn Cheese Balls","d":"Crispy","p":140,"img":""},{"n":"Garlic Bread","d":"Herb butter","p":120,"img":""}],
    "drinks":[{"n":"Smoothie","d":"Berry/banana","p":170,"img":""},{"n":"Soda","d":"Assorted","p":60,"img":""},{"n":"Bottled Water","d":"500 ml","p":30,"img":""}],
    "main":[{"n":"Paneer Kathi Roll","d":"Street style","p":190,"img":""},{"n":"Chicken Kathi Roll","d":"Spicy & juicy","p":220,"img":""},{"n":"Falafel Wrap","d":"Hummus & tahini","p":200,"img":""}]
  }},
  {"id":"quick-bite","name":"Quick Bite","type":"Fast Food","img":"","menu":{
    "starters":[{"n":"Cheese Fries","d":"Melted topping","p":140,"img":""},{"n":"Tater Tots","d":"Crispy bites","p":130,"img":""},{"n":"Chicken Wings","d":"Hot & spicy","p":240,"img":""}],
    "drinks":[{"n":"Soda","d":"Assorted","p":60,"img":""},{"n":"Vanilla Shake","d":"Creamy","p":160,"img":""},{"n":"Iced Latte","d":"Chilled","p":150,"img":""}],
    "main":[{"n":"Zinger Burger","d":"Crispy chicken","p":230,"img":""},{"n":"Veg Supreme Burger","d":"All the fixings","p":200,"img":""},{"n":"Chicken Wrap","d":"Garlic mayo","p":210,"img":""}]
  }},
  /* Ice cream x2 */
  {"id":"scoop-station","name":"Scoop Station","type":"Ice Cream","img":"","menu":{
    "starters":[{"n":"Waffle Cone","d":"Fresh baked","p":40,"img":""},{"n":"Brownie Bits","d":"Add-on","p":50,"img":""},{"n":"Sprinkles","d":"Add-on","p":30,"img":""}],
    "drinks":[{"n":"Thick Shake","d":"Chocolate/Vanilla","p":170,"img":""},{"n":"Floats","d":"Cola + vanilla","p":140,"img":""},{"n":"Iced Coffee","d":"Sweet","p":120,"img":""}],
    "main":[{"n":"Single Scoop","d":"Any flavour","p":90,"img":""},{"n":"Double Scoop","d":"Mix & match","p":140,"img":""},{"n":"Sundae","d":"Toppings galore","p":180,"img":""}]
  }},
  {"id":"frost-fiesta","name":"Frost Fiesta","type":"Ice Cream","img":"","menu":{
    "starters":[{"n":"Chocolate Chips","d":"Add-on","p":30,"img":""},{"n":"Roasted Nuts","d":"Add-on","p":40,"img":""},{"n":"Hot Fudge","d":"Add-on","p":40,"img":""}],
    "drinks":[{"n":"Milkshake","d":"Strawberry/Butterscotch","p":170,"img":""},{"n":"Affogato","d":"Espresso + scoop","p":180,"img":""},{"n":"Cold Coffee","d":"Classic","p":120,"img":""}],
    "main":[{"n":"Single Scoop","d":"Any flavour","p":90,"img":""},{"n":"Double Scoop","d":"Mix & match","p":140,"img":""},{"n":"Sundae Boat","d":"3 toppings","p":200,"img":""}]
  }},
  /* Junk food x3 */
  {"id":"snack-shack","name":"Snack Shack","type":"Junk Food","img":"","menu":{
    "starters":[{"n":"Chips (Large)","d":"Masala/Plain","p":60,"img":""},{"n":"Nacho Chips","d":"Cheese dust","p":80,"img":""},{"n":"Popcorn","d":"Salted","p":70,"img":""}],
    "drinks":[{"n":"Cola","d":"500 ml","p":40,"img":""},{"n":"Energy Drink","d":"250 ml","p":120,"img":""},{"n":"Iced Tea","d":"Lemon","p":60,"img":""}],
    "main":[{"n":"Chocolate Bar","d":"Assorted","p":50,"img":""},{"n":"Cookie Pack","d":"Assorted","p":60,"img":""},{"n":"Instant Noodles","d":"Cup","p":70,"img":""}]
  }},
  {"id":"chill-chug","name":"Chill & Chug","type":"Junk Food","img":"","menu":{
    "starters":[{"n":"Masala Chips","d":"Spicy","p":60,"img":""},{"n":"Tortilla Chips","d":"Crunchy","p":70,"img":""},{"n":"Noodle Cup","d":"Classic masala","p":70,"img":""}],
    "drinks":[{"n":"Orange Soda","d":"500 ml","p":40,"img":""},{"n":"Sparkling Water","d":"330 ml","p":50,"img":""},{"n":"Cold Coffee Can","d":"Ready-to-drink","p":90,"img":""}],
    "main":[{"n":"Chocolate Assortment","d":"Mini bars","p":90,"img":""},{"n":"Nutty Bar","d":"Peanut caramel","p":60,"img":""},{"n":"Cookie Bites","d":"Choco chip","p":65,"img":""}]
  }},
  {"id":"grab-n-go","name":"Grab N Go","type":"Junk Food","img":"","menu":{
    "starters":[{"n":"Nacho Tub","d":"Cheese dip","p":100,"img":""},{"n":"Salted Peanuts","d":"Roasted","p":50,"img":""},{"n":"Trail Mix","d":"Fruit & nut","p":120,"img":""}],
    "drinks":[{"n":"Cola / Lemonade","d":"500 ml","p":40,"img":""},{"n":"Iced Coffee","d":"Sweet","p":120,"img":""},{"n":"Bottled Water","d":"1 L","p":30,"img":""}],
    "main":[{"n":"Chocolate Cookies","d":"Pack of 6","p":70,"img":""},{"n":"Potato Chips","d":"Assorted flavours","p":60,"img":""},{"n":"Protein Bar","d":"Peanut butter","p":90,"img":""}]
  }}
];

/* --- State --- */
const STATE = {
  role: PAGE_ROLE,
  user: null,
  cart: [],
  orders: [],
  wallet: 500, // starter credit
};

const $ = (q,root=document) => root.querySelector(q);
const $$ = (q,root=document) => [...root.querySelectorAll(q)];

function toast(msg){ alert(msg); } // placeholder

/* Bypass login if coming from landing page */
function initializeFromLanding() {
  const bypassLogin = localStorage.getItem('campus_food_bypass_login') === 'true';
  if (bypassLogin) {
    const userName = localStorage.getItem('campus_food_user_name') || 'User';
    const userRoll = localStorage.getItem('campus_food_user_roll') || '23DS001';
    STATE.user = { name: userName, roll: userRoll, role: STATE.role };
    $("#loginModal")?.classList.add("hidden");
    localStorage.removeItem('campus_food_bypass_login'); // clear flag after use
    localStorage.removeItem('campus_food_user_name');
    localStorage.removeItem('campus_food_user_roll');
  }
}

/* Theme toggle */
const modeToggle = $("#modeToggle");
modeToggle?.addEventListener("click",()=>{
  const html=document.documentElement;
  html.classList.toggle("light");
  modeToggle.textContent = html.classList.contains("light") ? "☀️" : "🌙";
  localStorage.setItem('campus_food_theme', html.classList.contains('light') ? 'light' : 'dark');
});

// Initialize theme from localStorage
const theme = localStorage.getItem('campus_food_theme') || 'light';
if (theme === 'light') {
  document.documentElement.classList.add('light');
} else {
  document.documentElement.classList.remove('light');
}
modeToggle.textContent = document.documentElement.classList.contains('light') ? '☀️' : '🌙';

// Initialize from landing page if applicable
initializeFromLanding();

/* Login */
$("#btnLogin")?.addEventListener("click",()=>{
  const name = $("#inpName").value.trim();
  const roll = $("#inpRoll").value.trim();
  if(!name || !roll) return toast("Please enter name and roll number.");
  STATE.user = {name, roll, role: STATE.role};
  $("#loginModal").classList.add("hidden");
  toast(`Welcome, ${name}!`);
});

/* CTA buttons */
$("#ctaStartOrder")?.addEventListener("click",()=>openGallery());
$("#ctaMess")?.addEventListener("click",()=>openMessBooking());
$("#ctaManage")?.addEventListener("click",()=>openManage('day'));

/* Dropdown logic */
$$(".dropdown > button").forEach(btn=>{
  btn.addEventListener("click", e=>{
    const dd = btn.parentElement;
    dd.classList.toggle("open");
    $$(".dropdown").forEach(d=> d===dd?null:d.classList.remove("open"));
  });
});
document.addEventListener("click", (e)=>{
  if(!e.target.closest(".dropdown")) $$(".dropdown").forEach(d=>d.classList.remove("open"));
});

/* Menu actions */
document.addEventListener("click",(e)=>{
  const a = e.target.closest("[data-action]");
  if(!a) return;
  e.preventDefault();
  const action = a.getAttribute("data-action");
  if(action==="open-gallery") openGallery();
  if(action==="previous-orders") openPreviousOrders();
  if(action==="popular-spots") showPopular();
  if(action==="book-table") bookTable();
  if(action==="coupons") openCoupons();
  if(action==="wallet") openWallet();
  if(action==="payment-modes") openPaymentModes();
  if(action==="info") showInfo();
  if(action==="howto") showHowTo();
  if(action==="login-again") reLogin();
  if(action==="about") aboutCreators();
  if(action==="book-mess") openMessBooking();
  if(action==="cancel-mess") openMessCancel();
  if(action==="group-mess") openMessGroup();
  if(action==="mess-history") openMessHistory();
  if(action==="manage") openManage(a.dataset.scope);
});

/* Gallery */
function cardHtml(r){
  return `<div class="card">
    <img src="${r.img}" alt="${r.name} image placeholder"/>
    <div class="title">${r.name}</div>
    <div class="small">${r.type}</div>
    <div class="tag">Open now</div>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="openMenuWindow('${r.id}')">Explore menu</button>
      <button class="btn secondary" onclick="openRestaurant('${r.id}')">View details</button>
    </div>
  </div>`;
}
function renderGallery(){ $("#gallery").innerHTML = RESTAURANTS.map(cardHtml).join(""); }
function openGallery(){ document.getElementById("gallerySection").scrollIntoView({behavior:"smooth"}); }
renderGallery();

/* Details & Menu windows */
function openRestaurant(id){
  const rest = RESTAURANTS.find(r=>r.id===id);
  const w = window.open("", "_blank");
  const html = `<!doctype html><html><head><title>${rest.name}</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>${openWindowStyles()}</style></head>
    <body>
      <header class="header" style="background-image:url('${rest.img}')">
        <div class="overlay"></div>
        <div class="inner">
          <h1>${rest.name}</h1><p class="pill">${rest.type}</p>
          <button onclick="window.close()" class="chip">Close</button>
        </div>
      </header>
      <main class="wrap">
        <p>This is the detail page. Click below to explore the full menu.</p>
        <button onclick="window.location.href='about:blank'" class="btn">Open empty tab</button>
        <button onclick="window.menu && window.menu()" class="btn">Explore Menu</button>
      </main>
      <script>window.menu = function(){ window.opener.openMenuWindow('${id}'); };</script>
    </body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
}

function openMenuWindow(id){
  const rest = RESTAURANTS.find(r=>r.id===id);
  const w = window.open("", "_blank");
  const itemsBlock = (section, items)=>`
    <section id="${section}">
      <h2>${cap(section)}</h2>
      ${items.map(it=>`<div class='row'>
        <img src='${it.img}' alt='${it.n} image placeholder'/>
        <div class='meta'><div class='n'>${it.n}</div><div class='d'>${it.d}</div></div>
        <div class='price'>₹${it.p}</div>
        <button class='add' onclick='window.opener.addToCart({id:"${id}", rest:"${rest.name}", item:"${it.n}", price:${it.p} }); this.textContent="✓ Added";'>Add</button>
      </div>`).join("")}
    </section>`;
  const html = `<!doctype html><html><head><title>${rest.name} • Menu</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>${openWindowStyles()}</style></head>
    <body>
      <header class="header" style="background-image:url('${rest.img}')">
        <div class="overlay"></div>
        <div class="inner">
          <h1>${rest.name}</h1><p class="pill">${rest.type}</p>
          <nav class="tabs">
            <a href="#starters">Starters</a>
            <a href="#drinks">Drinks</a>
            <a href="#main">Main Course</a>
            <a href="#" onclick="window.opener && window.opener.openCart();return false;" class="cart">Open Cart 🛒</a>
          </nav>
        </div>
      </header>
      <main class="wrap">
        ${itemsBlock("starters", rest.menu.starters)}
        ${itemsBlock("drinks", rest.menu.drinks)}
        ${itemsBlock("main", rest.menu.main)}
      </main>
    </body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
}

function openWindowStyles(){
return `
  :root{--bg:#0b1020;--txt:#eef2ff;--pri:#7c5cff}
  body{margin:0;font-family:Inter,system-ui;background:linear-gradient(120deg,#0b1020,#101828);color:var(--txt)}
  .header{min-height:38vh;background-size:cover;background-position:center;position:relative}
  .overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.75))}
  .inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:24px 20px;gap:10px}
  .pill{display:inline-block;background:rgba(255,255,255,.2);padding:6px 10px;border-radius:999px}
  .tabs a{color:white;text-decoration:none;margin-right:10px;font-weight:700}
  .wrap{max-width:980px;margin:0 auto;padding:20px}
  section h2{margin-top:20px}
  .row{display:grid;grid-template-columns:90px 1fr auto auto;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.12)}
  .row img{width:90px;height:64px;object-fit:cover;border-radius:10px;background:#111}
  .row .n{font-weight:800}
  .row .d{opacity:.8;font-size:14px}
  .price{font-weight:800}
  .add{background:linear-gradient(135deg,var(--pri),#00d4ff);border:0;color:white;padding:8px 10px;border-radius:10px;cursor:pointer}
`;
}
function cap(s){return s[0].toUpperCase()+s.slice(1);}

/* Cart & Payments */
window.addToCart = function(item){ STATE.cart.push(item); };

window.openCart = function(){
  const w = window.open("", "_blank");
  const total = STATE.cart.reduce((a,c)=>a+c.price,0);
  const items = STATE.cart.map((it,i)=>`<tr><td>${i+1}</td><td>${it.rest}</td><td>${it.item}</td><td>₹${it.price}</td></tr>`).join("");
  const html = `<!doctype html><html><head><title>Cart</title><style>
    body{font-family:Inter,system-ui;background:#0b1020;color:#eef2ff;margin:0}
    .wrap{max-width:900px;margin:0 auto;padding:22px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid rgba(255,255,255,.15)}
    .total{text-align:right;font-weight:800}
    .btn{background:linear-gradient(135deg,#7c5cff,#00d4ff);border:0;color:white;padding:12px 14px;border-radius:12px;cursor:pointer}
  </style></head><body>
    <div class="wrap">
      <h1>🛒 Your Cart</h1>
      <table><thead><tr><th>#</th><th>Restaurant</th><th>Item</th><th>Price</th></tr></thead><tbody>${items}</tbody></table>
      <p class="total">Total: ₹${total}</p>
      <button class="btn" onclick="window.opener.openPayments(${total});">Proceed to Payment</button>
    </div>
  </body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
};

window.openPayments = function(amount){
  const w = window.open("", "_blank");
  const html = `<!doctype html><html><head><title>Payment</title><style>
    body{font-family:Inter,system-ui;background:#0b1020;color:#eef2ff;margin:0}
    .wrap{max-width:900px;margin:0 auto;padding:22px}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
    .card{border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:14px;background:#121936}
    button{margin-top:8px;border:0;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:white;padding:10px 12px;border-radius:10px;cursor:pointer}
  </style></head><body>
    <div class="wrap">
      <h1>💳 Select a payment mode</h1>
      <p>Amount payable: <b>₹${amount}</b></p>
      <div class="grid">
        <div class="card"><h3>UPI</h3><p>Pay via UPI apps</p><button onclick="done('UPI')">Pay</button></div>
        <div class="card"><h3>Card</h3><p>Visa/Mastercard</p><button onclick="done('Card')">Pay</button></div>
        <div class="card"><h3>Wallet</h3><p>Campus wallet</p><button onclick="done('Wallet')">Pay</button></div>
        <div class="card"><h3>Cash</h3><p>Pay at counter</p><button onclick="done('Cash')">Confirm</button></div>
      </div>
    </div>
    <script>
      function done(mode){
        window.opener && window.opener.paymentDone(mode, {amount:${amount}});
        document.body.innerHTML = '<div class="wrap"><h1>✅ Payment successful</h1><p>Mode: '+mode+'</p><button onclick="window.close()">Close</button></div>';
      }
    </script>
  </body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
};

window.paymentDone = function(mode, info){
  const total = STATE.cart.reduce((a,c)=>a+c.price,0);
  STATE.orders.push({when:new Date().toISOString(), mode, total, items:[...STATE.cart]});
  STATE.wallet = Math.max(0, STATE.wallet - (mode==='Wallet'? total : 0));
  STATE.cart = [];
  alert("Order placed! Payment mode: "+mode);
};

/* Previous orders */
function openPreviousOrders(){
  const w=window.open("","_blank");
  const rows = STATE.orders.map((o,i)=>`<tr><td>${i+1}</td><td>${new Date(o.when).toLocaleString()}</td><td>${o.mode}</td><td>₹${o.total}</td><td>${o.items.length}</td></tr>`).join("");
  w.document.write(`<!doctype html><html><head><title>Previous Orders</title><style>
    body{font-family:Inter,system-ui;background:#0b1020;color:#eef2ff;margin:0}
    .wrap{max-width:900px;margin:0 auto;padding:22px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid rgba(255,255,255,.15)}
  </style></head><body><div class='wrap'>
    <h1>🧾 Previous Orders</h1>
    <table><thead><tr><th>#</th><th>When</th><th>Mode</th><th>Total</th><th>Items</th></tr></thead><tbody>${rows || "<tr><td colspan=5>No orders yet</td></tr>"}</tbody></table>
  </div></body></html>`);
  w.document.close();
}

/* Misc shortcuts */
function showPopular(){
  const byType = RESTAURANTS.reduce((acc,r)=>{acc[r.type]=(acc[r.type]||0)+Math.floor(Math.random()*50+10);return acc;},{});
  alert("Today's popular categories:\n"+Object.entries(byType).map(([k,v])=>`• ${k} — ${v} orders`).join("\n"));
}
function bookTable(){
  const name = prompt("Name for reservation?");
  const size = prompt("Party size? (1-10)");
  if(name && size) alert(`Table booked for ${name} • ${size} people`);
}
function openCoupons(){ alert("Available coupons:\n• FRESH50 (₹50 off)\n• FIRST100 (₹100 off on ₹499+)\n• MEALPASS10 (10% off Mess)"); }
function openWallet(){ alert("Your campus wallet balance: ₹"+STATE.wallet); }
function openPaymentModes(){ alert("Supported: UPI, Card, Wallet, Cash"); }
function showInfo(){ alert("Info: This app helps students and staff order food, manage mess bookings, and for managers to operate dining at scale."); }
function showHowTo(){ alert("How to order: Browse restaurants → Explore menu → Add to cart → Open Cart → Proceed to Payment."); }
function reLogin(){ $("#loginModal").classList.remove("hidden"); }
function aboutCreators(){ alert("Built by your team. Add bios & images later in About section."); }

/* Hosteller: Mess features */
function openMessBooking(){
  const w = window.open("", "_blank");
  const meals = ["Breakfast","Lunch","Dinner"];
  const options = Array.from({length:10}, (_,i)=>`Option ${i+1}`);
  const html = `<!doctype html><html><head><title>Mess Booking</title><style>
    body{font-family:Inter,system-ui;background:#0b1020;color:#eef2ff;margin:0}
    .wrap{max-width:900px;margin:0 auto;padding:22px}
    select,input{padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#eef2ff}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0}
    button{border:0;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:white;padding:10px 12px;border-radius:10px;cursor:pointer}
  </style></head><body><div class="wrap">
    <h1>🏷️ Book Mess Food</h1>
    <div class="row">
      <div>
        <label>Meal</label>
        <select id="meal">${meals.map(m=>`<option>${m}</option>`).join("")}</select>
      </div>
      <div>
        <label>Choose menu</label>
        <select id="menu">${options.map(o=>`<option>${o}</option>`).join("")}</select>
      </div>
    </div>
    <div class="row">
      <div><label>Date</label><input type="date" id="date"/></div>
      <div><label>Time</label><input type="time" id="time"/></div>
    </div>
    <button onclick="book()">Book seat</button>
    <div id="out" style="margin-top:12px"></div>
    <script>
      function book(){
        const seat = Math.floor(Math.random()*1000)+1;
        const v = (id)=>document.getElementById(id).value;
        document.getElementById('out').innerHTML = '<p>✅ Booked '+v('meal')+' • '+v('menu')+' at '+v('time')+' on '+v('date')+'. Seat: <b>#'+seat+'</b></p>';
        window.opener && window.opener.saveMessHistory({meal:v('meal'), menu:v('menu'), time:v('time'), date:v('date'), seat});
      }
    </script>
  </div></body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
}
function openMessCancel(){
  const meal = prompt("Cancel which meal? (Breakfast/Lunch/Dinner)");
  if(meal) alert("Cancelled "+meal+" for today.");
}
function openMessGroup(){
  const count = prompt("Number of additional people?");
  if(!count) return;
  let names = [];
  for(let i=0;i<Number(count);i++) names.push(prompt("Enter name for guest #"+(i+1)));
  alert("Group mess booking confirmed for "+names.filter(Boolean).length+" guests.");
}
const MESS_HISTORY = [];
function saveMessHistory(entry){ MESS_HISTORY.push(entry); }
function openMessHistory(){
  if(!MESS_HISTORY.length) return alert("No mess payments yet.");
  const lines = MESS_HISTORY.map(m=>`• ${m.date} ${m.time} — ${m.meal} • Seat #${m.seat}`).join("\n");
  alert("Mess bookings/payment history:\n"+lines+"\nSubscription valid: 28 days remaining");
}

/* Manager: dashboards */
function openManage(scope){
  const fontMap = {"day":"'Poppins',sans-serif","hostel":"'Rubik',sans-serif","staff":"'Inter',sans-serif"};
  const stats = getManagerStats(scope);
  const w = window.open("", "_blank");
  const html = `<!doctype html><html><head><title>Manage ${scope}</title><style>
    :root{--bg:#0b1020;--txt:#eef2ff;--pri:#7c5cff}
    body{margin:0;background:#0b1020;color:#eef2ff;font-family:${fontMap[scope]}}
    .wrap{max-width:1100px;margin:0 auto;padding:22px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .card{background:#121936;border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:14px}
    .wide{grid-column: span 2}
    table{width:100%;border-collapse:collapse}
    th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,.15);text-align:left}
    .row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
    input,select{padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#eef2ff}
    button{border:0;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:white;padding:10px 12px;border-radius:10px;cursor:pointer}
  </style></head><body>
    <div class="wrap">
      <h1>🧰 Manage • ${scope.toUpperCase()}</h1>
      <div class="grid">
        <div class="card"><h3>Daily Sales</h3><div style="font-size:28px;font-weight:800">₹${stats.sales}</div></div>
        <div class="card"><h3>Popular Dish</h3><div style="font-size:22px;font-weight:800">${stats.popular}</div></div>
        <div class="card"><h3>Total Served</h3><div style="font-size:28px;font-weight:800">${stats.served}</div></div>
        <div class="card"><h3>Active Staff</h3><div style="font-size:28px;font-weight:800">${stats.staff}</div></div>
        <div class="card wide"><h3>Staff Management</h3>
          <div class="row">
            <input placeholder="Name"/>
            <select><option>Chef</option><option>Waiter</option><option>Admin</option></select>
            <select><option>Morning</option><option>Evening</option><option>Night</option></select>
          </div>
          <button style="margin-top:8px">Add / Update</button>
        </div>
        <div class="card wide"><h3>Customer Feedback (sample)</h3>
          <table><thead><tr><th>Order #</th><th>Rating</th><th>Feedback</th></tr></thead>
            <tbody>
              <tr><td>10421</td><td>4.5</td><td>Great taste and quick service.</td></tr>
              <tr><td>10422</td><td>3.8</td><td>Could be hotter.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body></html>`;
  w.document.open(); w.document.write(html); w.document.close();
}
function getManagerStats(scope){
  const base = {day:7000, hostel:13000, staff:250}[scope];
  const served = Math.floor(base * (0.15 + Math.random()*0.35));
  const sales = served * (120 + Math.floor(Math.random()*180));
  const popular = ["Butter Chicken","Margherita","Shoyu Ramen","Mango Lassi","Veg Burger"][Math.floor(Math.random()*5)];
  const staff = scope==='staff' ? 250 : 120 + Math.floor(Math.random()*60);
  return {served, sales, popular, staff};
}
