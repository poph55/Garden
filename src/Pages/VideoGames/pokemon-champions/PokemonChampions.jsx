import PokemonEntry from './PokemonEntry'

import archaludon  from './pokemon-icons/archaludon.png'
import pelipper    from './pokemon-icons/pelipper.png'
import dragonite   from './pokemon-icons/dragonite.png'
import basculegion from './pokemon-icons/basculegion-male.png'
import incineroar  from './pokemon-icons/incineroar.png'
import sneasler    from './pokemon-icons/sneasler.png'

import aerodactyl     from './pokemon-icons/aerodactyl.png'
import charizard      from './pokemon-icons/charizard.png'
import garchomp       from './pokemon-icons/garchomp.png'
import kingambit      from './pokemon-icons/kingambit.png'
import floetteEternal from './pokemon-icons/floette-eternal.png'

import leftovers    from './item-icons/leftovers.png'
import focusSash    from './item-icons/focus-sash.png'
import dragoninite  from './item-icons/dragoninite.png'
import choiceScarf  from './item-icons/choice-scarf.png'
import sitrusBerry  from './item-icons/sitrus.png'
import whiteHerb    from './item-icons/white-herb.png'

import charizarditeY from './item-icons/charizardite-y.png'
import dragonFang    from './item-icons/dragon-fang.png'
import chopleBerry   from './item-icons/chople.png'
import floettite     from './item-icons/floettite.png'

/*
  Each champion entry shape:
  {
    trainer: 'Red',
    game: 'Pokémon HeartGold',            // optional
    team: [                                // exactly 6 pokemon
      {
        name: 'Pikachu',
        sprite: pikachuImg,                // imported local image from pokemon-icons/
        type: 'Electric',                  // mandatory primary type
        type2: null,                       // optional secondary type (omit or null)
        item: leftoversImg,                // imported local image from item-icons/
        itemName: 'Leftovers',             // alt text for item image
        ability: 'Static',
        nature: 'Timid',                   // mandatory nature
        moves: [
          { name: 'Thunderbolt', type: 'Electric' },
          { name: 'Surf',        type: 'Water'    },
        ],
        evs: [0, 0, 0, 32, 0, 32],        // HP Atk Def SpA SpD Spe  (0–32)
      },
      ...
    ]
  }
*/
const champions = [
  {
    trainer: 'MDragonite Rain',
    team: [
      {
        name: 'Archaludon',
        sprite: archaludon,
        type: 'Steel',
        type2: 'Dragon',
        item: leftovers,
        itemName: 'Leftovers',
        ability: 'Stamina',
        nature: 'Modest',
        moves: [
          { name: 'Electro Shot',  type: 'Electric' },
          { name: 'Flash Cannon',  type: 'Steel'    },
          { name: 'Draco Meteor',  type: 'Dragon'   },
          { name: 'Protect',       type: 'Normal'   },
        ],
        evs: [32, 0, 0, 18, 0, 16],
      },
      {
        name: 'Pelipper',
        sprite: pelipper,
        type: 'Water',
        type2: 'Flying',
        item: focusSash,
        itemName: 'Focus Sash',
        ability: 'Drizzle',
        nature: 'Timid',
        moves: [
          { name: 'Hurricane',    type: 'Flying'  },
          { name: 'Tailwind',     type: 'Flying'  },
          { name: 'Weather Ball', type: 'Normal'  },
          { name: 'Wide Guard',   type: 'Rock'    },
        ],
        evs: [2, 0, 0, 32, 0, 32],
      },
      {
        name: 'Dragonite',
        sprite: dragonite,
        type: 'Dragon',
        type2: 'Flying',
        item: dragoninite,
        itemName: 'Dragoninite',
        ability: 'Multiscale',
        nature: 'Modest',
        moves: [
          { name: 'Draco Meteor', type: 'Dragon'   },
          { name: 'Thunder',      type: 'Electric' },
          { name: 'Hurricane',    type: 'Flying'   },
          { name: 'Protect',      type: 'Normal'   },
        ],
        evs: [2, 0, 0, 32, 0, 32],
      },
      {
        name: 'Basculegion',
        sprite: basculegion,
        type: 'Water',
        type2: 'Ghost',
        item: choiceScarf,
        itemName: 'Choice Scarf',
        ability: 'Adaptability',
        nature: 'Adamant',
        moves: [
          { name: 'Wave Crash',    type: 'Water' },
          { name: 'Aqua Jet',      type: 'Water' },
          { name: 'Flip Turn',     type: 'Water' },
          { name: 'Last Respects', type: 'Ghost' },
        ],
        evs: [2, 32, 0, 0, 0, 32],
      },
      {
        name: 'Incineroar',
        sprite: incineroar,
        type: 'Fire',
        type2: 'Dark',
        item: sitrusBerry,
        itemName: 'Sitrus Berry',
        ability: 'Intimidate',
        nature: 'Careful',
        moves: [
          { name: 'Parting Shot',    type: 'Dark'   },
          { name: 'Darkest Lariat',  type: 'Dark'   },
          { name: 'Fake Out',        type: 'Normal' },
          { name: 'Flare Blitz',     type: 'Fire'   },
        ],
        evs: [27, 8, 10, 0, 21, 0],
      },
      {
        name: 'Sneasler',
        sprite: sneasler,
        type: 'Fighting',
        type2: 'Poison',
        item: whiteHerb,
        itemName: 'White Herb',
        ability: 'Unburden',
        nature: 'Adamant',
        moves: [
          { name: 'Dire Claw',      type: 'Poison'   },
          { name: 'Close Combat',   type: 'Fighting' },
          { name: 'Fake Out',       type: 'Normal'   },
          { name: 'Protect',        type: 'Normal'   },
        ],
        evs: [18, 32, 0, 0, 0, 16],
      },
    ],
  },
  {
    trainer: 'Floettizard spread',
    team: [
      {
        name: 'Aerodactyl',
        sprite: aerodactyl,
        type: 'Rock',
        type2: 'Flying',
        item: focusSash,
        itemName: 'Focus Sash',
        ability: 'Unnerve',
        nature: 'Jolly',
        moves: [
          { name: 'Rock Slide',    type: 'Rock'   },
          { name: 'Dual Wingbeat', type: 'Flying' },
          { name: 'Tailwind',      type: 'Flying' },
          { name: 'Wide Guard',    type: 'Rock'   },
        ],
        evs: [2, 32, 0, 0, 0, 32],
      },
      {
        name: 'Charizard',
        sprite: charizard,
        type: 'Fire',
        type2: 'Flying',
        item: charizarditeY,
        itemName: 'Charizardite Y',
        ability: 'Solar Power',
        nature: 'Modest',
        moves: [
          { name: 'Heat Wave',    type: 'Fire'   },
          { name: 'Solar Beam',   type: 'Grass'  },
          { name: 'Weather Ball', type: 'Normal' },
          { name: 'Protect',      type: 'Normal' },
        ],
        evs: [2, 0, 0, 32, 0, 32],
      },
      {
        name: 'Garchomp',
        sprite: garchomp,
        type: 'Dragon',
        type2: 'Ground',
        item: dragonFang,
        itemName: 'Dragon Fang',
        ability: 'Rough Skin',
        nature: 'Adamant',
        moves: [
          { name: 'Earthquake',        type: 'Ground'  },
          { name: 'Stomping Tantrum',  type: 'Ground'  },
          { name: 'Scale Shot',        type: 'Dragon'  },
          { name: 'Protect',           type: 'Normal'  },
        ],
        evs: [2, 32, 0, 0, 0, 32],
      },
      {
        name: 'Kingambit',
        sprite: kingambit,
        type: 'Dark',
        type2: 'Steel',
        item: chopleBerry,
        itemName: 'Chople Berry',
        ability: 'Defiant',
        nature: 'Adamant',
        moves: [
          { name: 'Kowtow Cleave', type: 'Dark'     },
          { name: 'Sucker Punch',  type: 'Dark'     },
          { name: 'Low Kick',      type: 'Fighting' },
          { name: 'Protect',       type: 'Normal'   },
        ],
        evs: [32, 32, 0, 0, 2, 0],
      },
      {
        name: 'Basculegion',
        sprite: basculegion,
        type: 'Water',
        type2: 'Ghost',
        item: choiceScarf,
        itemName: 'Choice Scarf',
        ability: 'Adaptability',
        nature: 'Adamant',
        moves: [
          { name: 'Wave Crash',    type: 'Water' },
          { name: 'Aqua Jet',      type: 'Water' },
          { name: 'Flip Turn',     type: 'Water' },
          { name: 'Last Respects', type: 'Ghost' },
        ],
        evs: [2, 32, 0, 0, 0, 32],
      },
      {
        name: 'Floette-Eternal',
        sprite: floetteEternal,
        type: 'Fairy',
        item: floettite,
        itemName: 'Floettite',
        ability: 'Flower Veil',
        nature: 'Modest',
        moves: [
          { name: 'Moonblast',      type: 'Fairy'    },
          { name: 'Dazzling Gleam', type: 'Fairy'    },
          { name: 'Calm Mind',      type: 'Psychic'  },
          { name: 'Protect',        type: 'Normal'   },
        ],
        evs: [2, 0, 0, 32, 0, 32],
      },
    ],
  },
]

export default function PokemonChampions() {
  return (
    <div className="pokemon-champions">
      {champions.map((champion, i) => (
        <PokemonEntry key={i} {...champion} />
      ))}
    </div>
  )
}
