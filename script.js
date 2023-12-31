document.addEventListener('DOMContentLoaded', function () {
    function getTableNumberFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('table');
    }

    const tableNumber = getTableNumberFromUrl();
    const tableNumberElement = document.getElementById('table-number');
    tableNumberElement.textContent = `Table N° ${tableNumber || 'Non spécifiée'}`;

    const menuItems = [
        { category: 'Nos Pizza', plat: 'Pizza au feu de bois', description: 'Délicieuse pizza cuite au feu de bois.', Prix: 1300.00, image: 'https://rahihakma.dz/wp-content/uploads/2023/05/IMG_8364-e1683480335307.webp' },
	{ category: 'Nos Pizza', plat: 'Pizza végétarienne', description: 'Sauce tomate, Fromage, Poivron, Tomate Fraiche, Champignon .', Prix: 700.00, image: 'https://maxi.cdnartwhere.eu/wp-content/uploads/recipe/2016-01/pizza-vegetarienne.jpg' },    
	{ category: 'Nos Soupe', plat: 'Soupe de Lentilles', description: 'Délicieuse soupe.', Prix: 350.00, image: 'https://d2sz1kgdtrlf1n.cloudfront.net/yelo_products/thumb-400-400-a0e4hdfaHawcm61653260469213-Soupe20de20lentille.jpg' },
        { category: 'Nos Entrées Froides', plat: 'Houmous', description: 'Entrée incontournable.', Prix: 500.00, image: 'https://d2sz1kgdtrlf1n.cloudfront.net/yelo_products/thumb-400-400-fjtnngl5O5pc551653260551026-HOUMOUS.jpg' },
        { category: 'Nos Entrées Froides', plat: 'Yogurtlu Salatasi', description: 'Fromage naturel fait maison.', Prix: 550.00, image: 'https://d2sz1kgdtrlf1n.cloudfront.net/yelo_products/thumb-400-400-k66shqqdAlnqg21653260769589-Yogurtlu20Patlican20Salatasi.jpg' },
	{ category: 'Nos Grillades', plat: 'Brochette de poulet piquante', description: 'poulet Bio Frais du jour.', Prix: 1200.00, image: 'https://hichamcook.dz/storage/2022/10/brochette-poulet-piquante.png' },        
	{ category: 'Nos Burgers', plat: 'Cheese burger', description: 'A la viande fraiche.', Prix: 1000.00, image: 'https://d2sz1kgdtrlf1n.cloudfront.net/yelo_products/thumb-400-400-8meijueq12DdCM1653261537299-Casbah20Cheese.jpg' },
        { category: 'Nos Desserts', plat: 'Salade de fruits', description: 'aux fruits selectionné du jour.', Prix: 1250.00, image: 'https://img.cuisineaz.com/660x660/2013/12/20/i26162-salade-de-fruits-d-ete-facile.jpg' },
	{ category: 'Nos Pizza', plat: 'Pizza Marguerite', description: 'Sauce tomate Fromage poulet.', Prix: 600.00, image: 'https://www.delicieux.fr/wp-content/uploads/2020/08/Pizza-margherita-classique.jpg' },
	
        
    ];

    const menuElement = document.getElementById('menu');
    const cartElement = document.getElementById('cart');
    const orderSummaryDiv = document.getElementById('order-summary');
    const cart = [];

    const categories = new Set(menuItems.map(item => item.category));

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `<h2>${category}</h2>`;
        menuElement.appendChild(categoryElement);

        menuItems.filter(item => item.category === category).forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-card';
            menuItem.innerHTML = `
                <h3>${item.plat}</h3>
                <img src="${item.image}" alt="${item.plat}" onclick="openModal('${item.image}')">
		 <p>${item.description}</p>
                <p>Prix: ${item.Prix.toFixed(2)} DA</p>
                <button class="button-Ajouter" onclick="addToCart('${item.plat}', ${item.Prix})">Ajouter</button><br><br>
                <input type="number" value="1" min="1">
            `;
            categoryElement.appendChild(menuItem);
        });
    });

    window.addToCart = function (itemName, itemPrix) {
        const quantityInput = event.target.parentNode.querySelector('input[type="number"]');
        const quantity = parseInt(quantityInput.value);

        const existingItem = cart.find(item => item.plat === itemName);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ plat: itemName, Prix: itemPrix, quantity: quantity, tableNumber: tableNumber });
        }

        updateCartDisplay();

        // Utilisez SweetAlert2 pour afficher le message personnalisé
        Swal.fire({
            icon: 'success',
            title: 'Ajouté avec succès !',
            showConfirmButton: true,
            // Fermer automatiquement après 3 secondes
            timer: 2000,
        });
    };

    window.increaseQuantity = function (itemName) {
        const existingItem = cart.find(item => item.plat === itemName);

        if (existingItem) {
            existingItem.quantity += 1;
            updateCartDisplay();
        }
    };

    window.decreaseQuantity = function (itemName) {
        const existingItem = cart.find(item => item.plat === itemName);

        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            updateCartDisplay();
        }
    };

    window.removeItem = function (itemName) {
        const itemIndex = cart.findIndex(item => item.plat === itemName);

        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            updateCartDisplay();
        }
    };

    function updateCartDisplay() {
        cartElement.innerHTML = `<h3>Commande ${tableNumber ? 'Table ' + tableNumber : 'Non spécifiée'}</h3>`;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            const totalplat = (item.Prix * item.quantity).toFixed(2);

            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.quantity} x ${item.plat} - Total Plat : ${totalplat} DA<p>
                <button class="button-plus" onclick="increaseQuantity('${item.plat}')">+</button>
                <button class="button-moins" onclick="decreaseQuantity('${item.plat}')">-</button>
                <button class="button-delete" onclick="removeItem('${item.plat}')">Supprimer</button>
            `;
            cartElement.appendChild(cartItem);
        });

        const totalPrix = cart.reduce((total, item) => total + item.Prix * item.quantity, 0).toFixed(2);

        const totalElement = document.createElement('div');
        totalElement.innerHTML = `<h4>Total général : ${totalPrix} DA</h4>`;
        cartElement.appendChild(totalElement);
    }

    window.submitOrder = function () {
        // Ajoutez l'identifiant de la table à l'objet cart
        const cartWithTableNumber = { tableNumber, cart };

        // Supprimez la propriété "tableNumber" de chaque élément du panier
        const cartWithoutItemTableNumber = cart.map(item => {
            const { tableNumber, ...rest } = item;
            return rest;
        });

        // Ajoutez le panier modifié à l'objet cart
        const cartJSON = JSON.stringify({ tableNumber, cart: cartWithoutItemTableNumber });

        // Mise à jour de la div order-summary avec le contenu du panier
        orderSummaryDiv.innerHTML = '';

        // Clonez les éléments <h3>
        for (const child of cartElement.children) {
            let nodeName = child.nodeName ? child.nodeName.toLowerCase() : '';

            if (nodeName === 'h3') {
                const clonedChild = child.cloneNode(true);
                orderSummaryDiv.appendChild(clonedChild);
            }
        }

        // Clonez les nœuds enfants de .cart-item
        for (const cartItem of cartElement.querySelectorAll('.cart-item')) {
            const pElement = cartItem.querySelector('p');

            if (pElement) {
                // Clonez le <p> mais sans les boutons
                const clonedP = pElement.cloneNode(true);
                const buttons = clonedP.querySelectorAll('button');
                buttons.forEach(button => button.remove());
                orderSummaryDiv.appendChild(clonedP);
            }
        }

        // Rendez orderSummaryDiv invisible
        orderSummaryDiv.style.display = 'none';

        // Rendez orderSummaryDiv invisible
        orderSummaryDiv.style.display = 'none';

        // Affichez une alerte de succès ou utilisez SweetAlert2
		
		const totalPrix = cart.reduce((total, item) => total + item.Prix * item.quantity, 0).toFixed(2);
        Swal.fire({
        icon: 'success',
        title: 'Confirmation !',
        html: orderSummaryDiv.innerHTML + `<strong><p>Total de la commande : ${totalPrix} DA</p></strong>`,
        showCancelButton: true,
        cancelButtonColor: '#FFA500',
        showConfirmButton: true,
        preConfirm: function () {
            // Récupérez le contenu HTML de orderSummaryDiv
            const orderSummaryHTML = orderSummaryDiv.innerHTML;

            // Supprimez les balises <h3> et <p> du contenu HTML
            const cleanedHTML = orderSummaryHTML.replace(/<\/?(h3|p)[^>]*>/g, '');

            // Générez le QR code avec le contenu JSON
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(cartJSON)}`;

            // Affichez un nouveau SweetAlert avec le QR code
            Swal.fire({
                icon: 'success',
                title: 'Je suis votre commande présentez moi au serveur !',
                html: `<img src="${qrCodeUrl}" alt="QR Code" style="max-width: 100%;">`,
            });
        },
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            // L'utilisateur a cliqué sur "Cancel"
            // Rafraîchissez la page pour effacer complètement le contenu de la div avec l'id "cart"
            location.reload(true);
            }
        });
    };
});
