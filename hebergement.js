document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('accommodation-container');

    fetch('hebergement.json')
        .then(response => response.json())
        .then(data => {
            data.accommodations.forEach(accommodation => {
                const card = createAccommodationCard(accommodation);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des hébergements:', error);
            container.innerHTML = '<p>Erreur lors du chargement des hébergements.</p>';
        });
});

function createAccommodationCard(accommodation) {
    const card = document.createElement('div');
    card.className = 'accommodation-card';

    if (accommodation.photo) {
        const photo = document.createElement('img');
        photo.src = accommodation.photo;
        photo.alt = accommodation.name;
        photo.className = 'accommodation-photo';
        card.appendChild(photo);
    }

    const title = document.createElement('h3');
    title.className = 'accommodation-title';
    title.textContent = accommodation.name;

    const details = document.createElement('ul');
    details.className = 'accommodation-details';

    const detailItems = [
        { emoji: '👥', text: accommodation.capacity },
        { emoji: '💶', text: accommodation.price },
        { emoji: '🚶', text: accommodation.walkingDistance },
        { emoji: '🚗', text: accommodation.drivingDistance }
    ];

    detailItems.forEach(item => {
        if (item.text) {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.emoji}</span> ${item.text}`;
            details.appendChild(li);
        }
    });

    const link = document.createElement('a');
    if (accommodation.link) {
        link.href = accommodation.link;
        link.target = '_blank';
        link.className = 'btn';
        link.textContent = 'Voir / Réserver';
    } else {
        link.href = '#';
        link.className = 'btn Link-disabled';
        link.style.cursor = 'default';
        link.style.opacity = '0.7';
        link.textContent = 'Lien à venir';
    }

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(link);

    return card;
}
