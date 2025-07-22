import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, ChevronRight } from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';

interface SnippetSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (snippet: string) => void;
  category: string;
}

const SNIPPET_CATEGORIES = {
  card: {
    title: 'Cards',
    snippets: [
      {
        name: 'Card Simple',
        code: `<div class="card">
  <div class="card-header">
    <h3>Titre de la carte</h3>
  </div>
  <div class="card-body">
    <p>Contenu de la carte</p>
    <button class="btn btn-primary">Action</button>
  </div>
</div>`
      },

  
      {
        name: 'Cards 3D Flip (Parallax)',
        code: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Parallax Flipping Cards</title>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: #f0f0f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: normal;
  color: #444;
  text-align: center;
  margin: 2rem 0;
}

.wrapper {
  width: 90%;
  margin: 0 auto;
  max-width: 80rem;
}

.cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.col {
  width: calc(25% - 2rem);
  margin: 1rem;
  cursor: pointer;
}

.container {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.front,
.back {
  background-size: cover;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.25);
  border-radius: 10px;
  background-position: center;
  transition: transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
  backface-visibility: hidden;
  text-align: center;
  min-height: 280px;
  height: auto;
  border-radius: 10px;
  color: #fff;
  font-size: 1.5rem;
}

.back {
  background: linear-gradient(45deg, #cedce7 0%, #596a72 100%);
}

.front:after {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  content: '';
  display: block;
  opacity: .6;
  background-color: #000;
  backface-visibility: hidden;
  border-radius: 10px;
}

.container:hover .front,
.container:hover .back {
  transition: transform .7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.inner {
  transform: translateY(-50%) translateZ(60px) scale(0.94);
  top: 50%;
  position: absolute;
  left: 0;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  outline: 1px solid transparent;
  perspective: inherit;
  z-index: 2;
}

.container .back {
  transform: rotateY(180deg);
  transform-style: preserve-3d;
}

.container .front {
  transform: rotateY(0deg);
  transform-style: preserve-3d;
}

.container:hover .back {
  transform: rotateY(0deg);
  transform-style: preserve-3d;
}

.container:hover .front {
  transform: rotateY(-180deg);
  transform-style: preserve-3d;
}

.front .inner p {
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.front .inner p:after {
  content: '';
  width: 4rem;
  height: 2px;
  position: absolute;
  background: #C6D4DF;
  display: block;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -.75rem;
}

.front .inner span {
  color: rgba(255,255,255,0.7);
  font-family: 'Montserrat';
  font-weight: 300;
}

@media screen and (max-width: 64rem) {
  .col {
    width: calc(33.333333% - 2rem);
  }
}

@media screen and (max-width: 48rem) {
  .col {
    width: calc(50% - 2rem);
  }
}

@media screen and (max-width: 32rem) {
  .col {
    width: 100%;
    margin: 0 0 2rem 0;
  }
}
</style>
</head>
<body>

<div class="wrapper">
  <h1>Parallax Flipping Cards</h1>
  <div class="cols">
    <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
        <div class="front" style="background-image: url(https://unsplash.it/500/500/)">
          <div class="inner">
            <p>Diligord</p>
            <span>Lorem ipsum</span>
          </div>
        </div>
        <div class="back">
          <div class="inner">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias cum repellat velit quae suscipit c.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
        <div class="front" style="background-image: url(https://unsplash.it/511/511/)">
          <div class="inner">
            <p>Rocogged</p>
            <span>Lorem ipsum</span>
          </div>
        </div>
        <div class="back">
          <div class="inner">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias cum repellat velit quae suscipit c.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
        <div class="front" style="background-image: url(https://unsplash.it/502/502/)">
          <div class="inner">
            <p>Strizzes</p>
            <span>Lorem ipsum</span>
          </div>
        </div>
        <div class="back">
          <div class="inner">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias cum repellat velit quae suscipit c.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
        <div class="front" style="background-image: url(https://unsplash.it/503/503/)">
          <div class="inner">
            <p>Clossyo</p>
            <span>Lorem ipsum</span>
          </div>
        </div>
        <div class="back">
          <div class="inner">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias cum repellat velit quae suscipit c.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`
      },


      {
        name: 'Card avec Image',
        code: `<div class="card">
  <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Image">
  <div class="card-body">
    <h5 class="card-title">Titre avec image</h5>
    <p class="card-text">Description de la carte avec image.</p>
    <a href="#" class="btn btn-primary">Voir plus</a>
  </div>
</div>`
      },
      {
        name: 'Card Produit',
        code: `<div class="product-card">
  <div class="product-image">
    <img src="https://via.placeholder.com/250x250" alt="Produit">
    <div class="product-badge">Nouveau</div>
  </div>
  <div class="product-info">
    <h4 class="product-title">Nom du produit</h4>
    <p class="product-price">29,99 €</p>
    <button class="btn btn-cart">Ajouter au panier</button>
  </div>
</div>`
      },
        // Ajouter ce snippet dans la catégorie 'card' après 'Cards 3D Flip (Parallax)'
        {
          name: 'Cards Flip Stats (NFL)',
          code: `<!DOCTYPE html>
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cards Flip Stats</title>
  <style>
  * {
    box-sizing: border-box;
  }
  
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column wrap;
    background: #1f1f1f;
    color: white;
    font-family: "Lato", sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
    overflow-x: hidden;
  }
  
  .card {
    float: left;
    position: relative;
    width: calc(100% * .3333 - 30px + .3333 * 30px);
    height: 340px;
    margin: 0 30px 30px 0;
    perspective: 1000;
  }
  
  .card:nth-child(3n) {
    margin-right: 0;
  }
  
  .card__flipper {
    cursor: pointer;
    transform-style: preserve-3d;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .card__front, .card__back {
    position: absolute;
    backface-visibility: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 340px;
  }
  
  .card__front {
    transform: rotateY(0);
    z-index: 2;
    overflow: hidden;
  }
  
  .card__back {
    transform: rotateY(180deg) scale(1.1);
    background: #141414;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .card__name {
    font-size: 32px;
    line-height: 0.9;
    font-weight: 700;
  }
  
  .card__name span {
    font-size: 14px;
  }
  
  .card__num {
    font-size: 100px;
    margin: 0 8px 0 0;
    font-weight: 700;
  }
  
  /* Couleurs des cartes */
  .card:nth-child(1) .card__front { background: #5271C2; }
  .card:nth-child(2) .card__front { background: #35a541; }
  .card:nth-child(3) .card__front { background: #bdb235; }
  .card:nth-child(4) .card__front { background: #db6623; }
  .card:nth-child(5) .card__front { background: #3e5eb3; }
  .card:nth-child(6) .card__front { background: #aa9e5c; }
  
  .card__back span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: 900;
  }
  
  /* Animation au clic */
  .card.active {
    z-index: 3;
  }
  
  .card.active .card__flipper {
    transform: rotateY(180deg);
  }
  
  @media (max-width: 700px) {
    .card {
      width: 100%;
      height: 290px;
      margin-right: 0;
      float: none;
    }
    .card .card__front,
    .card .card__back {
      height: 290px;
    }
    .card__num {
      font-size: 70px;
    }
  }
  </style>
  </head>
  <body>
  
  <main>
    <h1>Statistiques NFL</h1>
    <p>Cliquez sur les cartes pour voir les stats</p>
  </main>
  
  <ul>
    <li class="card">
      <div class="card__flipper">
        <div class="card__front">
          <p class="card__name"><span>Tony</span><br>Romo</p>
          <p class="card__num">9</p>
        </div>
        <div class="card__back">
          <svg height="180" width="180">
            <circle cx="90" cy="90" r="55" stroke="#514d9b" stroke-width="35" fill="none" />
          </svg>
          <span>113.2</span>
        </div>
      </div>
    </li>
    <li class="card">
      <div class="card__flipper">
        <div class="card__front">
          <p class="card__name"><span>Aaron</span><br>Rodgers</p>
          <p class="card__num">12</p>
        </div>
        <div class="card__back">
          <svg height="180" width="180">
            <circle cx="90" cy="90" r="55" stroke="#35a541" stroke-width="35" fill="none" />
          </svg>
          <span>112.2</span>
        </div>
      </div>
    </li>
    <li class="card">
      <div class="card__flipper">
        <div class="card__front">
          <p class="card__name"><span>Ben</span><br>Roethlisberger</p>
          <p class="card__num">7</p>
        </div>
        <div class="card__back">
          <svg height="180" width="180">
            <circle cx="90" cy="90" r="55" stroke="#bdb235" stroke-width="35" fill="none" />
          </svg>
          <span>103.3</span>
        </div>
      </div>
    </li>
  </ul>
  
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script>
  $(document).ready(function() {
    var cards = $('.card');
    
    cards.on('click', function() {
      var thisCard = $(this);
      
      if (thisCard.hasClass('active')) {
        thisCard.removeClass('active');
      } else {
        cards.removeClass('active');
        thisCard.addClass('active');
      }
    });
    
    // Fermer en cliquant ailleurs
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.card').length) {
        cards.removeClass('active');
      }
    });
  });
  </script>
  
  </body>
  </html>`
        }, 
      {
        name: 'Card Profil',
        code: `<div class="profile-card">
  <div class="profile-avatar">
    <img src="https://via.placeholder.com/100x100" alt="Avatar">
  </div>
  <div class="profile-info">
    <h3 class="profile-name">John Doe</h3>
    <p class="profile-role">Développeur Web</p>
    <div class="profile-social">
      <a href="#" class="social-link">LinkedIn</a>
      <a href="#" class="social-link">GitHub</a>
    </div>
  </div>
</div>`
      }
    ]
  },
  button: {
    title: 'Boutons',
    snippets: [
      {
        name: 'Bouton Primary',
        code: `<button class="btn btn-primary">
  <span class="btn-text">Cliquer ici</span>
</button>`
      },
    

      // Ajouter ces snippets dans la catégorie 'button' après 'Bouton Floating'
      {
        name: 'Bouton Neumorphique 1',
        code: `<!-- Bouton Neumorphique Style 1 -->
<style>
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-1 {
  background: rgb(6,14,131);
  background: linear-gradient(0deg, rgba(6,14,131,1) 0%, rgba(12,25,180,1) 100%);
  border: none;
}

.btn-1:hover {
  background: rgb(0,3,255);
  background: linear-gradient(0deg, rgba(0,3,255,1) 0%, rgba(2,126,251,1) 100%);
}
</style>

<button class="custom-btn btn-1">Read More</button>`
      },
      {
        name: 'Bouton Neumorphique 2',
        code: `<!-- Bouton Neumorphique Style 2 -->
<style>
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-2 {
  background: rgb(96,9,240);
  background: linear-gradient(0deg, rgba(96,9,240,1) 0%, rgba(129,5,240,1) 100%);
  border: none;
}

.btn-2:hover {
  box-shadow: 4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .5),
              inset -4px -4px 6px 0 rgba(255,255,255,.2),
              inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
}
</style>

<button class="custom-btn btn-2">Read More</button>`
      },
      {
        name: 'Bouton Border Animate',
        code: `<!-- Bouton avec animation de bordure -->
<style>
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-3 {
  background: rgb(0,172,238);
  background: linear-gradient(0deg, rgba(0,172,238,1) 0%, rgba(2,126,251,1) 100%);
  line-height: 42px;
  padding: 0;
  border: none;
}

.btn-3 span {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.btn-3:before,
.btn-3:after {
  position: absolute;
  content: "";
  right: 0;
  top: 0;
  background: rgba(2,126,251,1);
  transition: all 0.3s ease;
}

.btn-3:before {
  height: 0%;
  width: 2px;
}

.btn-3:after {
  width: 0%;
  height: 2px;
}

.btn-3:hover {
  background: transparent;
  box-shadow: none;
}

.btn-3:hover:before {
  height: 100%;
}

.btn-3:hover:after {
  width: 100%;
}

.btn-3 span:before,
.btn-3 span:after {
  position: absolute;
  content: "";
  left: 0;
  bottom: 0;
  background: rgba(2,126,251,1);
  transition: all 0.3s ease;
}

.btn-3 span:before {
  width: 2px;
  height: 0%;
}

.btn-3 span:after {
  width: 0%;
  height: 2px;
}

.btn-3 span:hover:before {
  height: 100%;
}

.btn-3 span:hover:after {
  width: 100%;
}
</style>

<button class="custom-btn btn-3"><span>Read More</span></button>`
      },
      {
        name: 'Bouton Slice Effect',
        code: `<!-- Bouton avec effet slice -->
<style>
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-5 {
  width: 130px;
  height: 40px;
  line-height: 42px;
  padding: 0;
  border: none;
  background: rgb(255,27,0);
  background: linear-gradient(0deg, rgba(255,27,0,1) 0%, rgba(251,75,2,1) 100%);
}

.btn-5:hover {
  color: #f0094a;
  background: transparent;
  box-shadow: none;
}

.btn-5:before,
.btn-5:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;
  background: #f0094a;
  box-shadow: -1px -1px 5px 0px #fff,
              7px 7px 20px 0px #0003,
              4px 4px 5px 0px #0002;
  transition: 400ms ease all;
}

.btn-5:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}

.btn-5:hover:before,
.btn-5:hover:after {
  width: 100%;
  transition: 800ms ease all;
}
</style>

<button class="custom-btn btn-5"><span>Read More</span></button>`
      },
      {
        name: 'Bouton 3D Flip',
        code: `<!-- Bouton 3D Flip -->
<style>
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-12 {
  position: relative;
  right: 20px;
  bottom: 20px;
  border: none;
  box-shadow: none;
  width: 130px;
  height: 40px;
  line-height: 42px;
  perspective: 230px;
}

.btn-12 span {
  background: rgb(0,172,238);
  background: linear-gradient(0deg, rgba(0,172,238,1) 0%, rgba(2,126,251,1) 100%);
  display: block;
  position: absolute;
  width: 130px;
  height: 40px;
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  border-radius: 5px;
  margin: 0;
  text-align: center;
  box-sizing: border-box;
  transition: all .3s;
}

.btn-12 span:nth-child(1) {
  box-shadow: -7px -7px 20px 0px #fff9,
              -4px -4px 5px 0px #fff9,
              7px 7px 20px 0px #0002,
              4px 4px 5px 0px #0001;
  transform: rotateX(90deg);
  transform-origin: 50% 50% -20px;
}

.btn-12 span:nth-child(2) {
  transform: rotateX(0deg);
  transform-origin: 50% 50% -20px;
}

.btn-12:hover span:nth-child(1) {
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  transform: rotateX(0deg);
}

.btn-12:hover span:nth-child(2) {
  box-shadow: inset 2px 2px 2px 0px rgba(255,255,255,.5),
              7px 7px 20px 0px rgba(0,0,0,.1),
              4px 4px 5px 0px rgba(0,0,0,.1);
  color: transparent;
  transform: rotateX(-90deg);
}
</style>

<button class="custom-btn btn-12"><span>Click!</span><span>Read More</span></button>`
      }, 

      // Ajouter ces snippets dans la catégorie 'button' après les boutons neumorphiques
      {
        name: 'Bouton Swipe',
        code: `<!-- Bouton Swipe Effect -->
<style>
.btn-swipe {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #b49aaf;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-swipe:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #645261;
  transform: translateX(-100%);
  transition: 0.5s ease-in-out;
  z-index: -1;
}

.btn-swipe:hover {
  color: #e9e1e8;
}

.btn-swipe:hover:before {
  transform: translateX(0);
}
</style>

<a class="btn-swipe" href="#">Swipe</a>`
      },
      {
        name: 'Bouton Diagonal Swipe',
        code: `<!-- Bouton Diagonal Swipe -->
<style>
.btn-diagonal {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #65cc36;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-diagonal:before {
  content: "";
  position: absolute;
  top: 0;
  right: -50px;
  bottom: 0;
  left: 0;
  border-right: 50px solid transparent;
  border-bottom: 80px solid #2c750b;
  transform: translateX(-100%);
  transition: 0.5s ease-in-out;
  z-index: -1;
}

.btn-diagonal:hover {
  color: #d2f0c4;
}

.btn-diagonal:hover:before {
  transform: translateX(0);
}
</style>

<a class="btn-diagonal" href="#">Diagonal Swipe</a>`
      },
      {
        name: 'Bouton Double Swipe',
        code: `<!-- Bouton Double Swipe -->
<style>
.btn-double {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #9fbd97;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-double:before,
.btn-double:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-bottom: 80px solid #556a50;
  z-index: -1;
  transition: 0.5s ease-in-out;
}

.btn-double:before {
  right: -50px;
  border-right: 50px solid transparent;
  transform: translateX(-100%);
}

.btn-double:after {
  left: -50px;
  border-left: 50px solid transparent;
  transform: translateX(100%);
}

.btn-double:hover {
  color: #e3ece1;
}

.btn-double:hover:before {
  transform: translateX(-40%);
}

.btn-double:hover:after {
  transform: translateX(40%);
}
</style>

<a class="btn-double" href="#">Double Swipe</a>`
      },
      {
        name: 'Bouton Position Aware',
        code: `<!-- Bouton Position Aware (suit la souris) -->
<style>
.btn-position {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #b5563b;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-position span {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: #65220e;
  transition: width 0.4s ease-in-out, height 0.4s ease-in-out;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.btn-position:hover {
  color: #e9cdc5;
}

.btn-position:hover span {
  width: 225%;
  height: 562.5px;
}

.btn-position:active {
  background-color: #a83818;
}
</style>

<a class="btn-position" href="#">Position Aware<span></span></a>

<script>
// Nécessite jQuery
$(function () {
  $(".btn-position")
    .on("mouseenter", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    })
    .on("mouseout", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    });
});
</script>`
      },
      {
        name: 'Bouton 4 Corners',
        code: `<!-- Bouton 4 Corners -->
<style>
.btn-corners {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #4d77b5;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-corners span {
  display: block;
  position: relative;
  z-index: 1;
}

.btn-corners:before,
.btn-corners:after,
.btn-corners span:before,
.btn-corners span:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #1b3965;
  transition: 0.5s ease-in-out;
  z-index: -1;
}

.btn-corners:before {
  transform: translate(-100%, -100%);
}

.btn-corners:after {
  transform: translate(-100%, 100%);
}

.btn-corners span:before {
  transform: translate(100%, -100%);
}

.btn-corners span:after {
  transform: translate(100%, 100%);
}

.btn-corners:hover {
  color: #cbd7e9;
}

.btn-corners:hover:before {
  transform: translate(-50%, -50%);
}

.btn-corners:hover:after {
  transform: translate(-50%, 50%);
}

.btn-corners:hover span:before {
  transform: translate(50%, -50%);
}

.btn-corners:hover span:after {
  transform: translate(50%, 50%);
}
</style>

<a class="btn-corners" href="#"><span>4 Corners</span></a>`
      },
      {
        name: 'Bouton Slice Diagonal',
        code: `<!-- Bouton Slice Diagonal -->
<style>
.btn-slice {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #346bc4;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-slice:before,
.btn-slice:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 0 solid;
  transform: rotate(360deg);
  transition: 0.5s ease-in-out;
  z-index: -1;
}

.btn-slice:before {
  bottom: 0;
  left: 0;
  border-color: transparent transparent transparent #0a3170;
}

.btn-slice:after {
  top: 0;
  right: 0;
  border-color: transparent #0a3170 transparent transparent;
}

.btn-slice:hover {
  color: #c3d4ee;
}

.btn-slice:hover:before,
.btn-slice:hover:after {
  border-width: 80px 262.5px;
}
</style>

<a class="btn-slice" href="#">Slice</a>`
      },
      {
        name: 'Bouton Collision',
        code: `<!-- Bouton Collision Effect -->
<style>
@keyframes criss-cross-left {
  0% {
    left: -20px;
  }
  50% {
    left: 50%;
    width: 20px;
    height: 20px;
  }
  100% {
    left: 50%;
    width: 375px;
    height: 375px;
  }
}

@keyframes criss-cross-right {
  0% {
    right: -20px;
  }
  50% {
    right: 50%;
    width: 20px;
    height: 20px;
  }
  100% {
    right: 50%;
    width: 375px;
    height: 375px;
  }
}

.btn-collision {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 250px;
  height: 80px;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  color: #498faf;
  line-height: 80px;
  text-align: center;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  transition: 0.5s ease-in-out;
}

.btn-collision:before,
.btn-collision:after {
  position: absolute;
  top: 50%;
  content: "";
  width: 20px;
  height: 20px;
  background-color: #297ba1;
  border-radius: 50%;
  z-index: -1;
}

.btn-collision:before {
  left: -20px;
  transform: translate(-50%, -50%);
}

.btn-collision:after {
  right: -20px;
  transform: translate(50%, -50%);
}

.btn-collision:hover {
  color: #cadee8;
}

.btn-collision:hover:before {
  animation: criss-cross-left 0.8s both;
  animation-direction: alternate;
}

.btn-collision:hover:after {
  animation: criss-cross-right 0.8s both;
  animation-direction: alternate;
}
</style>

<a class="btn-collision" href="#">Collision</a>`
      },
      {
        name: 'Bouton avec Icône',
        code: `<button class="btn btn-icon">
  <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
  <span class="btn-text">Favoris</span>
</button>`
      },
      {
        name: 'Bouton Gradient',
        code: `<button class="btn btn-gradient">
  <span class="btn-text">Gradient</span>
  <span class="btn-shine"></span>
</button>`
      },
      {
        name: 'Bouton Outline',
        code: `<button class="btn btn-outline">
  <span class="btn-text">Outline</span>
</button>`
      },
      {
        name: 'Bouton Floating',
        code: `<button class="btn btn-floating">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 2v20M2 12h20"/>
  </svg>
</button>`
      }
    ]
  },
  navbar: {
    title: 'Navigation',
    snippets: [
      {
        name: 'Navbar Simple',
        code: `<nav class="navbar">
  <div class="navbar-brand">
    <a href="#" class="brand-link">Mon Site</a>
  </div>
  <ul class="navbar-nav">
    <li class="nav-item"><a href="#" class="nav-link">Accueil</a></li>
    <li class="nav-item"><a href="#" class="nav-link">À propos</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
  </ul>
</nav>`
      },
      {
        name: 'Navbar avec Menu Mobile',
        code: `<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">
      <a href="#" class="brand-link">Logo</a>
    </div>
    <button class="navbar-toggle" id="navbar-toggle">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    <ul class="navbar-menu" id="navbar-menu">
      <li class="navbar-item"><a href="#" class="navbar-link">Accueil</a></li>
      <li class="navbar-item"><a href="#" class="navbar-link">Services</a></li>
      <li class="navbar-item"><a href="#" class="navbar-link">Portfolio</a></li>
      <li class="navbar-item"><a href="#" class="navbar-link">Contact</a></li>
    </ul>
  </div>
</nav>`
      },
      {
        name: 'Navbar Bootstrap',
        code: `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>`
      }
    ]
  },
  footer: {
    title: 'Footers',
    snippets: [
      {
        name: 'Footer Simple',
        code: `<footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Mon Site. Tous droits réservés.</p>
  </div>
</footer>`
      },
      {
        name: 'Footer Complet',
        code: `<footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <h4>À propos</h4>
      <p>Description de votre entreprise ou site web.</p>
    </div>
    <div class="footer-section">
      <h4>Liens rapides</h4>
      <ul>
        <li><a href="#">Accueil</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h4>Contact</h4>
      <p>Email: contact@monsite.com</p>
      <p>Tél: +33 1 23 45 67 89</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2024 Mon Site. Tous droits réservés.</p>
  </div>
</footer>`
      },
      {
        name: 'Footer avec Réseaux',
        code: `<footer class="footer-social">
  <div class="footer-container">
    <div class="footer-brand">
      <h3>Mon Site</h3>
      <p>Votre description ici</p>
    </div>
    <div class="footer-links">
      <div class="link-group">
        <h4>Entreprise</h4>
        <a href="#">À propos</a>
        <a href="#">Équipe</a>
        <a href="#">Carrières</a>
      </div>
      <div class="link-group">
        <h4>Support</h4>
        <a href="#">FAQ</a>
        <a href="#">Contact</a>
        <a href="#">Documentation</a>
      </div>
    </div>
    <div class="footer-social-links">
      <a href="#" class="social-link">Facebook</a>
      <a href="#" class="social-link">Twitter</a>
      <a href="#" class="social-link">LinkedIn</a>
    </div>
  </div>
</footer>`
      }
    ]
  },
  form: {
    title: 'Formulaires',
    snippets: [
      {
        name: 'Formulaire Contact',
        code: `<form class="contact-form">
  <div class="form-group">
    <label for="name">Nom complet</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Envoyer</button>
</form>`
      },
      {
        name: 'Formulaire Connexion',
        code: `<form class="login-form">
  <div class="form-header">
    <h2>Connexion</h2>
  </div>
  <div class="form-group">
    <label for="username">Nom d'utilisateur</label>
    <input type="text" id="username" name="username" required>
  </div>
  <div class="form-group">
    <label for="password">Mot de passe</label>
    <input type="password" id="password" name="password" required>
  </div>
  <div class="form-options">
    <label class="checkbox">
      <input type="checkbox" name="remember">
      <span>Se souvenir de moi</span>
    </label>
    <a href="#" class="forgot-link">Mot de passe oublié ?</a>
  </div>
  <button type="submit" class="btn btn-login">Se connecter</button>
</form>`
      },
      {
        name: 'Formulaire Inscription',
        code: `<form class="register-form">
  <h2>Créer un compte</h2>
  <div class="form-row">
    <div class="form-group">
      <label for="firstName">Prénom</label>
      <input type="text" id="firstName" name="firstName" required>
    </div>
    <div class="form-group">
      <label for="lastName">Nom</label>
      <input type="text" id="lastName" name="lastName" required>
    </div>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="password">Mot de passe</label>
    <input type="password" id="password" name="password" required>
  </div>
  <div class="form-group">
    <label for="confirmPassword">Confirmer le mot de passe</label>
    <input type="password" id="confirmPassword" name="confirmPassword" required>
  </div>
  <div class="form-group">
    <label class="checkbox">
      <input type="checkbox" name="terms" required>
      <span>J'accepte les <a href="#">conditions d'utilisation</a></span>
    </label>
  </div>
  <button type="submit" class="btn btn-register">S'inscrire</button>
</form>`
      }
    ]
  },
  links: {
    title: 'Liens CSS',
    snippets: [
      {
        name: 'Bootstrap CSS',
        code: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">`
      },
      {
        name: 'Bootstrap JS',
        code: `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>`
      },
      {
        name: 'Tailwind CSS',
        code: `<script src="https://cdn.tailwindcss.com"></script>`
      },
      {
        name: 'Font Awesome',
        code: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">`
      },
      {
        name: 'Google Fonts',
        code: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
      },
      {
        name: 'Animate.css',
        code: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">`
      },
      {
        name: 'CSS Local',
        code: `<link rel="stylesheet" href="style.css">`
      },
      {
        name: 'JavaScript Local',
        code: `<script src="script.js"></script>`
      }
    ]
  },
  meta: {
    title: 'Meta Tags',
    snippets: [
      {
        name: 'Meta SEO Complet',
        code: `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Description de votre page">
<meta name="keywords" content="mot-clé1, mot-clé2, mot-clé3">
<meta name="author" content="Votre nom">
<meta name="robots" content="index, follow">
<title>Titre de votre page</title>`
      },
      {
        name: 'Open Graph',
        code: `<meta property="og:title" content="Titre de votre page">
<meta property="og:description" content="Description pour les réseaux sociaux">
<meta property="og:image" content="https://votre-site.com/image.jpg">
<meta property="og:url" content="https://votre-site.com">
<meta property="og:type" content="website">`
      },
      {
        name: 'Twitter Cards',
        code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Titre de votre page">
<meta name="twitter:description" content="Description pour Twitter">
<meta name="twitter:image" content="https://votre-site.com/image.jpg">`
      },
      {
        name: 'Meta Mobile',
        code: `<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000000">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
      }
    ]
  }
};

export function SnippetSelector({ visible, onClose, onSelect, category }: SnippetSelectorProps) {
  const [selectedSnippet, setSelectedSnippet] = useState<string | null>(null);
  const theme = useFileStore(state => state.theme);

  // Définir les couleurs par thème (doit correspondre à THEME_COLORS)
  const THEME_COLORS = {
    cyberpunk: {
      border: '#00ff41',
      title: '#00ff41',
      snippetName: '#00ff41',
      preview: '#666',
      background: '#1a1a1a',
    },
    neon: {
      border: '#39ff14',
      title: '#39ff14',
      snippetName: '#39ff14',
      preview: '#ff00c8',
      background: '#1a1a1a',
    },
    matrix: {
      border: '#00ff41',
      title: '#00ff41',
      snippetName: '#00ff41',
      preview: '#003300',
      background: '#1a1a1a',
    },
    'blade runner': {
      border: '#ff6600',
      title: '#ff6600',
      snippetName: '#ff6600',
      preview: '#fffb00',
      background: '#1a1a1a',
    },
  };
  const colors = THEME_COLORS[theme] || THEME_COLORS.cyberpunk;

  const categoryData = SNIPPET_CATEGORIES[category as keyof typeof SNIPPET_CATEGORIES];
  if (!categoryData) {
    return null;
  }

  const handleSnippetSelect = (snippet: string) => {
    onSelect(snippet);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.title }]}>{categoryData.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.snippetsList} showsVerticalScrollIndicator={false}>
            {categoryData.snippets.map((snippet, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.snippetItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSnippetSelect(snippet.code)}
              >
                <View style={styles.snippetHeader}>
                  <Text style={[styles.snippetName, { color: colors.snippetName }]}>{snippet.name}</Text>
                  <ChevronRight size={16} color={colors.title} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={[styles.snippetPreview, { color: colors.preview }]}>
                    {snippet.code.substring(0, 100)}...
                  </Text>
                </ScrollView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#00ff41',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  snippetsList: {
    maxHeight: 400,
  },
  snippetItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  snippetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  snippetName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  snippetPreview: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});