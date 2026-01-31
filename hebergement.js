let allAccommodations = [];

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('accommodation-container');

    fetch('hebergement.json')
        .then(response => response.json())
        .then(data => {
            allAccommodations = data.accommodations;
            renderAccommodations(allAccommodations);
            setupFilters();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des hébergements:', error);
            container.innerHTML = '<p>Erreur lors du chargement des hébergements.</p>';
        });
});

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            const filtered = filterAccommodations(filter);
            renderAccommodations(filtered);
        });
    });
}

function formatCapacity(capacityArray) {
    if (capacityArray.length === 1) {
        return `${capacityArray[0]} personnes`;
    }
    const min = Math.min(...capacityArray);
    const max = Math.max(...capacityArray);
    return `${min} à ${max} personnes`;
}

function getMaxCapacity(capacityArray) {
    return Math.max(...capacityArray);
}

function filterAccommodations(filter) {
    if (filter === 'all') return allAccommodations;

    return allAccommodations.filter(acc => {
        const capacities = acc.capacity;

        switch(filter) {
            case '1-2':
                return capacities.some(c => c <= 2);
            case '4-6':
                return capacities.some(c => c >= 4 && c <= 6);
            case '8+':
                return capacities.some(c => c >= 8);
            default:
                return true;
        }
    });
}

function renderAccommodations(accommodations) {
    const container = document.getElementById('accommodation-container');
    container.innerHTML = '';

    if (accommodations.length === 0) {
        container.innerHTML = '<p class="no-results">Aucun hébergement trouvé pour ce filtre.</p>';
        return;
    }

    accommodations.forEach(accommodation => {
        const card = createAccommodationCard(accommodation);
        container.appendChild(card);
    });
}

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
        { emoji: '👥', text: formatCapacity(accommodation.capacity) },
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
