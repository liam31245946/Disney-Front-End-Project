// IDC what you do, compiling first!!!!!!!!!!!!!

interface Data {
  _id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  allies: string[];
  enemies: string[];
  parkAttractions: string[];
  sourceUrl: string;
  url: string;
}

interface info {
  data: Data[];
}

async function disneyData(): Promise<void> {
  try {
    const response = await fetch('https://api.disneyapi.dev/character');
    if (!response.ok) {
      throw new Error(`http error ${response.status}`);
    }
    // data got return
    const data: info = await response.json();

    // looping over the character
    data.data.forEach((charData) => {
      if ($row) {
        const $charCard = renderCharacter(charData);
        $row.appendChild($charCard);
      }
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}

const $searchInput = document.querySelector(
  '.search-character',
) as HTMLInputElement;

if ($searchInput) {
  $searchInput.addEventListener('input', () => {
    const searchQuery = $searchInput.value.toLowerCase();

    // Select all character cards
    const characterCards = document.querySelectorAll('.column-fourth');

    characterCards.forEach((card) => {
      // Get the name of the character in the current card
      const charName =
        card.querySelector('p')?.textContent?.toLowerCase() || '';

      // Show or hide based on search query
      if (charName.includes(searchQuery)) {
        card.classList.remove('hidden'); // Show matching cards
      } else {
        card.classList.add('hidden'); // Hide non-matching cards
      }
    });
  });
}

// Starting from here is mostly issue 2

// function use to show information of individual card.

const $mainPage = document.querySelector(
  '[data-view="main-page"]',
) as HTMLElement;
const $characterDetail = document.querySelector(
  '[data-view="character-page"]',
) as HTMLElement;

function showCharacterDetail(charData: Data): void {
  const $characterName = document.querySelector(
    '.characterName',
  ) as HTMLElement;
  const $characterTVshow = document.querySelector(
    '.characterTVshow',
  ) as HTMLElement;
  const $characterPic = document.querySelector(
    '#character-image',
  ) as HTMLImageElement;
  const $characterFilm = document.querySelector(
    '.characterFilm',
  ) as HTMLElement;
  const $characterVideogames = document.querySelector(
    '.characterVideogames',
  ) as HTMLElement;
  const $characterInfo = document.querySelector(
    '.characterInfo',
  ) as HTMLElement;

  $characterPic.src = charData.imageUrl;
  $characterPic.alt = charData.name;
  $characterName.textContent = `Character Name: ${charData.name}`;

  if ($characterTVshow) {
    $characterTVshow.textContent = charData.tvShows.length
      ? `TV Show : ${charData.tvShows.join(' , ')}`
      : `TV Show: N/A, does not exist`;
  }

  $characterFilm.textContent = `Film: ${charData.films.join(' , ')}`;

  $characterVideogames.textContent = charData.videoGames.length
    ? `Video Game: ${charData.videoGames.join(' ')}`
    : `Video Game: N/A, does not exist`;
  $characterInfo.innerHTML = `Character's Information on Wikipedia <a href="${charData.sourceUrl}">${charData.sourceUrl}</a>`;

  // Set data-id on Favorite and Dislike buttons
  if ($addDislike) {
    $addDislike.setAttribute('data-id', charData._id.toString());
  }

  if ($addFavorite) {
    $addFavorite.setAttribute('data-id', charData._id.toString());
  }

  // main page swapping

  $mainPage.classList.add('hidden');
  $favoritePage.classList.add('hidden');
  $dislikePage.classList.add('hidden');
  $characterDetail.classList.remove('hidden');
}

const $row = document.querySelector('.row') as HTMLElement;

// render function, use to create element in html

function renderCharacter(charData: Data): HTMLElement {
  const $div = document.createElement('div');
  $div.classList.add('column-fourth');

  const $img = document.createElement('img');
  $img.src = charData.imageUrl;
  $img.alt = charData.name;

  // description of character
  const $p = document.createElement('p');
  $p.textContent = charData.name;

  $div.appendChild($img);
  $div.appendChild($p);

  // this is a click to click the character card on the main page
  $div.addEventListener('click', () => {
    // this function is below to select individual character card
    showCharacterDetail(charData);
  });

  return $div;
}

// Disney header navbar, one way ticket back to main page

const $navbar = document.querySelector('.navbar') as HTMLElement;

if ($navbar) {
  $navbar.addEventListener('click', () => {
    // this is 2 data-view
    const $mainPage = document.querySelector('[data-view="main-page"]');
    const $characterPage = document.querySelector(
      '[data-view="character-page"',
    );

    // click on Walt Disney = go back to main page
    $characterPage?.classList.add('hidden');
    $favoritePage.classList.add('hidden');
    $mainPage?.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  disneyData();
});

// This is Where the Fun Begin, Here is all the local storage code for dislike and favorite start

// first part will be code in Character-Page

// Local storage function will be in data.ts

// function to display character's data, this is the annoying part to fix and will not try to do it again

async function characterDataById(id: number): Promise<Data | null> {
  try {
    const response = await fetch(`https://api.disneyapi.dev/character/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();
    return result.data; // Return only the character data
  } catch (error) {
    return null;
  }
}

const $addDislike = document.querySelector('.addDislike');
const $addFavorite = document.querySelector('.addFavorite');
const $dialogFavorite = document.querySelector(
  '.favorite',
) as HTMLDialogElement;
const $dialogDislike = document.querySelector('.dislike') as HTMLDialogElement;
const $dismiss = document.querySelector('.dismiss') as HTMLDialogElement;
const $dismiss1 = document.querySelector('.dismiss1') as HTMLDialogElement;

// show dialog !!
$addDislike?.addEventListener('click', () => {
  $dialogDislike?.showModal();
});

$addFavorite?.addEventListener('click', () => {
  $dialogFavorite?.showModal();
});

$dismiss1?.addEventListener('click', () => {
  $dialogFavorite.close();
});

$dismiss?.addEventListener('click', () => {
  $dialogDislike.close();
});

// function to save the character to local storage !!!!!!

function handleAddToList(key: string, characterId: number): void {
  // Get the current list (favorite or dislike)
  const list = getFromLocalStorage(key);

  // Determine the opposite list
  const oppositeKey = key === 'favoriteList' ? 'dislikeList' : 'favoriteList';
  const oppositeList = getFromLocalStorage(oppositeKey);

  // Check if the character exists in the opposite list
  const inOppositeListIndex = oppositeList.findIndex(
    (character: Data) => character._id === characterId,
  );

  // Remove the character from the opposite list if it exists
  if (inOppositeListIndex !== -1) {
    oppositeList.splice(inOppositeListIndex, 1);
    saveToLocalStorage(oppositeKey, oppositeList);
  }

  // Check if the character is already in the current list
  const inList = list.some((character: Data) => character._id === characterId);

  // If not already in the list, fetch character data and add it
  if (!inList) {
    characterDataById(characterId).then((charData) => {
      if (charData) {
        list.push(charData); // Add the character to the current list
        saveToLocalStorage(key, list); // Save updated list to local storage
      }
    });
  }
}

// this make sure the data-id being passed down correct (now as string)
if ($addDislike) {
  $addDislike.addEventListener('click', () => {
    const characterId = Number($addDislike.getAttribute('data-id')); // Get the character's ID
    if (characterId) {
      handleAddToList('dislikeList', characterId);
    }
  });
}

if ($addFavorite) {
  $addFavorite.addEventListener('click', () => {
    const characterId = Number($addFavorite.getAttribute('data-id')); // Get the character's ID
    if (characterId) {
      handleAddToList('favoriteList', characterId);
    }
  });
}

// Event listeners, this click will then move data to local storage
if ($addDislike) {
  $addDislike.addEventListener('click', () => {
    const characterId = Number($addDislike.getAttribute('data-id')); // Set ID during rendering
    handleAddToList('dislikeList', characterId);
  });
}

if ($addFavorite) {
  $addFavorite.addEventListener('click', () => {
    const characterId = Number($addFavorite.getAttribute('data-id')); // Set ID during rendering
    handleAddToList('favoriteList', characterId);
  });
}

// This is where issue 3 start

// from main page click on favorite button and lead to a new page

const $favoritePage = document.querySelector(
  '[data-view="favorite-page"]',
) as HTMLElement;

const $viewFavoriteButton = document.querySelector('.viewFavoriteButton');

// listen to click to switch to favorite page
$viewFavoriteButton?.addEventListener('click', () => {
  $mainPage.classList.add('hidden');
  $characterDetail.classList.add('hidden');
  $dislikePage.classList.add('hidden');
  $favoritePage.classList.remove('hidden');

  // how the data in  local storage
  const displayFavorite = getFromLocalStorage('favoriteList');

  const showRow = $favoritePage.querySelector('.row') as HTMLElement;
  showRow.innerHTML = '';

  // loop over all the chardata in favorite list

  displayFavorite.forEach((charData) => {
    const $character = renderCharacter(charData);
    showRow.appendChild($character);
  });
});

// this is a test, do not try it

const $dislikePage = document.querySelector(
  '[data-view="dislike-page"]',
) as HTMLElement;

const $viewDislikeButton = document.querySelector('.viewDislikeButton');

// listen to click to switch to favorite page
$viewDislikeButton?.addEventListener('click', () => {
  $mainPage.classList.add('hidden');
  $characterDetail.classList.add('hidden');
  $favoritePage.classList.add('hidden');
  $dislikePage.classList.remove('hidden');

  // how the data in  local storage
  const displayFavorite = getFromLocalStorage('dislikeList');

  const showRow = $dislikePage.querySelector('.row') as HTMLElement;
  showRow.innerHTML = '';

  // loop over all the chardata in favorite list

  displayFavorite.forEach((charData) => {
    const $character = renderCharacter(charData);
    showRow.appendChild($character);
  });
});
