import { useState } from 'react'
import vallaQ from './assets/valla-q.jpg'
import vallaW from './assets/valla-w.jpg'
import vallaE from './assets/valla-e.jpg'
import vallaD from './assets/valla-d.jpg'
import vallaStrafe from './assets/valla-strafe.jpg'
import vallaRain from './assets/valla-rain.jpg'
import blazeQ from './assets/blaze-q.jpg'
import blazeE from './assets/blaze-e.jpg'
import blazeD from './assets/blaze-d.jpg'
import blazeBunker from './assets/blaze-bunker.jpg'
import blazeStim from './assets/blaze-stim.jpg'
import anduinQ from './assets/anduin-q.jpg'
import anduinW from './assets/anduin-w.jpg'
import anduinE from './assets/anduin-e.jpg'
import anduinD from './assets/anduin-d.jpg'
import anduinLightbomb from './assets/anduin-lightbomb.jpg'
import anduinLightwell from './assets/anduin-lightwell.jpg'
import jainaQ from './assets/jaina-q.jpg'
import jainaW from './assets/jaina-w.jpg'
import jainaE from './assets/jaina-e.jpg'
import jainaD from './assets/jaina-d.jpg'
import jainaElemental from './assets/jaina-elemental.jpg'
import jainaVeins from './assets/jaina-veins.jpg'
import junkratQ from './assets/junkrat-q.png'
import junkratW from './assets/junkrat-w.png'
import junkratE from './assets/junkrat-e.png'
import junkratTire from './assets/junkrat-tire.png'
import junkratTrait from './assets/junkrat-trait.png'
import lucioQ from './assets/lucio-q.png'
import lucioW from './assets/lucio-w.png'
import lucioE from './assets/lucio-e.png'
import lucioD from './assets/lucio-d.png'
import lucioFive from './assets/lucio-five.png'
import johannaQ from './assets/johanna-punish_hexagon.png'
import johannaW from './assets/johanna-condemn_hexagon.png'
import johannaE from './assets/johanna-shield-glare_hexagon.png'
import johannaD from './assets/johanna-iron-skin_hexagon.png'
import johannaShield from './assets/johanna-blessed-shield_hexagon.png'
import hoggerQ from './assets/hogger-staggering-blow.png'
import hoggerW from './assets/hogger-ez-thro-dynamite.png'
import hoggerE from './assets/hogger-hogg-wild.png'
import hoggerD from './assets/hogger-loot-hoard.png'
import hoggerHoard from './assets/hogger-hoardapult.png'
import hoggerShockwave from './assets/hogger-shockwave.png'
import yrelQ from './assets/yrel-vindication_hexagon.png'
import yrelW from './assets/yrel-righteous-hammer_hexagon.png'
import yrelE from './assets/yrel-avenging-wrath_hexagon.png'
import yrelD from './assets/yrel-divine-purpose_hexagon.png'
import yrelArdent from './assets/yrel-ardent-defender_hexagon.png'
import yrelGround from './assets/yrel-sacred-ground_hexagon.png'
import qhiraQ from './assets/qhira-carnage_hexagon.png'
import qhiraW from './assets/qhira-blood-rage_hexagon.png'
import qhiraE from './assets/qhira-revolving-sweep_hexagon.png'
import qhiraD from './assets/qhira-grappling-hook_hexagon.png'
import qhiraFinal from './assets/qhira-final-strike_hexagon.png'
import falstadQ from './assets/falstad-hammerang_hexagon.png'
import falstadW from './assets/falstad-lightning-rod_hexagon.png'
import falstadE from './assets/falstad-barrel-roll_hexagon.png'
import falstadZ from './assets/falstad-flight_hexagon.png'
import falstadGust from './assets/falstad-mighty-gust_hexagon.png'
import falstadTrait from './assets/falstad-tailwind_hexagon.png'
import sylvanasQ from './assets/sylvanas-withering-fire_hexagon.png'
import sylvanasW from './assets/sylvanas-shadow-dagger_hexagon.png'
import sylvanasE from './assets/sylvanas-haunting-wave_hexagon.png'
import sylvanasD from './assets/sylvanas-black-arrows_hexagon.png'
import sylvanasMind from './assets/sylvanas-mind-control_hexagon.png'
import sylvanasArrow from './assets/sylvanas-wailing-arrow_hexagon.png'
import brightwingQ from './assets/brightwing-arcane-flare_hexagon.png'
import brightwingW from './assets/brightwing-polymorph_hexagon.png'
import brightwingE from './assets/brightwing-pixie-dust_hexagon.png'
import brightwingZ from './assets/brightwing-phase-shift_hexagon.png'
import brightwingD from './assets/brightwing-soothing-mist_hexagon.png'
import brightwingBlink from './assets/brightwing-blink-heal_hexagon.png'
import rehgarQ from './assets/rehgar-chain-heal_hexagon.png'
import rehgarW from './assets/rehgar-lightning-shield_hexagon.png'
import rehgarE from './assets/rehgar-earthbind-totem_hexagon.png'
import rehgarD from './assets/rehgar-ghost-wolf_hexagon.png'
import rehgarAncestral from './assets/rehgar-ancestral-healing_hexagon.png'
import mephistoQ from './assets/mephisto-skull-missile_hexagon.png'
import mephistoW from './assets/mephisto-lightning-nova_hexagon.png'
import mephistoE from './assets/mephisto-shade-of-mephisto_hexagon.png'
import mephistoD from './assets/mephisto-lord-of-hatred_hexagon.png'
import mephistoDurance from './assets/mephisto-durance-of-hate_hexagon.png'
import aurielQ from './assets/auriel-sacred-sweep_hexagon.png'
import aurielW from './assets/auriel-ray-of-heaven_hexagon.png'
import aurielE from './assets/auriel-detainment-strike_hexagon.png'
import aurielD from './assets/auriel-bestow-hope_hexagon.png'
import aurielAegis from './assets/auriel-crystal-aegis_hexagon.png'
import './HeroesOfTheStorm.css'

const HEROES = [
  {
    id: 'valla', name: 'Valla', title: 'Demon Hunter', role: 'Ranged Assassin', universe: 'Diablo', accent: '#dc607d', trait:vallaD,
    source: 'https://www.icy-veins.com/heroes/valla-build-guide', reviewed: 'May 2, 2025 · patch 2.55.10',
    overview: 'A fragile, high-output damage dealer who rewards disciplined positioning and constant Hatred upkeep.',
    abilities: [['Q','Hungering Arrow',vallaQ],['W','Multishot',vallaW],['E','Vault',vallaE],['D','Hatred',vallaD]],
    builds: [
      { title:'Multishot', subtitle:'Wide-angle pressure', icon:vallaW, summary:'Reliable area damage, fast Hatred generation, and simple teamfight value.', bestFor:'Clumped teams · waveclear · steady poke', gameplan:'Tag multiple Heroes with Multishot to stack Fire At Will, then use Arsenal’s extra range to pressure safely. Wait for enemy crowd control before committing to Strafe.', reminder:'Use Gloom before Multishot—Fire At Will quickly rebuilds the Hatred you spend.', talents:[[1,'Fire At Will','W','Stack Multishot damage and Hatred.',vallaW],[4,'Arsenal','W','Range, grenades, and Mana refund.',vallaW],[7,'Hot Pursuit','D','Extra speed for spacing and kiting.',vallaD],[10,'Strafe','R','Large-area teamfight damage.',vallaStrafe],[13,'Gloom','D','Spell Armor when burst threatens.',vallaD],[16,'Punishment','W','More Multishots at full Hatred.',vallaW],[20,'Death Siphon','R','Strafe healing and duration.',vallaStrafe]] },
      { title:'Hungering Arrow', subtitle:'Isolated-target burst', icon:vallaQ, summary:'Front-loaded single-target damage that punishes isolated enemies and burns objectives.', bestFor:'Burst comps · isolated targets · Battlefield of Eternity', gameplan:'Clear nearby summons and minions before firing so every bounce finds the intended target. Vault resets Hungering Arrow—save the sequence for a clean burst window.', reminder:'Do not fire through a minion wave—the bounces can home into the wrong targets.', talents:[[1,'Puncturing Arrow','Q','Add a bounce and stack impact damage.',vallaQ],[4,'Repeating Arrow','E','Vault resets Hungering Arrow.',vallaE],[7,'Frost Shot','W','Slow first; arrows hit harder.',vallaW],[10,'Rain of Vengeance','R','Stun setup, peel, and follow-up.',vallaRain],[13,'Siphoning Arrows','Q','Hero hits restore Health.',vallaQ],[16,'Seething Hatred','D','Boost damage at full Hatred.',vallaD],[20,'Acrobat','E','Extra Vaults enable arrow chains.',vallaE]] },
    ],
  },
  {
    id:'blaze', name:'Blaze', title:'Veteran Firebat', role:'Tank / Offlaner', universe:'StarCraft', accent:'#ef8d3f', trait:blazeD,
    source:'https://www.icy-veins.com/heroes/blaze-build-guide', reviewed:'July 20, 2026 · latest patch',
    overview:'A durable area-control tank with excellent waveclear, long-range engage, and a fight-saving Bunker.',
    abilities:[['Q','Flame Stream',blazeQ],['W','Oil Spill',blazeD],['E','Jet Propulsion',blazeE],['D','Pyromania',blazeD]],
    builds:[
      { title:'Basic Attacks', subtitle:'Offlane control', icon:blazeStim, summary:'Fast lane and camp clear with strong sustained pressure and late-game durability.', bestFor:'Offlane · mercenary camps · macro pressure', gameplan:'Keep your Health above 80% for Stimpack’s passive, clear waves with empowered Basic Attacks, and rotate early. Use Jet Propulsion from fog or after Oil slows the target.', reminder:'Bunker is a cleanse and damage reset for the whole team—not just an escape for Blaze.', talents:[[1,'Adrenaline Stimpack','1','Attack and movement speed.',blazeStim],[4,'Incinerator Gauntlets','AA','Empower wave and camp clear.',blazeQ],[7,'Suppressive Fire','Q','Reduce enemy Spell Power.',blazeQ],[10,'Bunker Drop','R','Team cleanse and protection.',blazeBunker],[13,'Collision Course','E','Jet impact burst.',blazeE],[16,'Juggernaut Plating','1','Anti-burst active defense.',blazeD],[20,'Fortified Bunker','R','More Armor and firepower.',blazeBunker]] },
      { title:'Oil Spill', subtitle:'Main-tank engage', icon:blazeD, summary:'Controls space with stronger Oil slows and creates reliable Jet Propulsion openings.', bestFor:'Main tank · two or fewer melee enemies · objective fights', gameplan:'Place Oil beyond the target so retreat crosses the full slow, then charge once movement is constrained. Ignite only when healing matters; unlit Oil controls space longer.', reminder:'Jet Propulsion is easier to land after Oil Spill—avoid opening with a visible max-range charge.', talents:[[1,'New Habits','D','Faster Pyromania and Unstoppable.',blazeD],[4,'Oil Dispersal','W','Larger, stronger Oil control.',blazeD],[7,'Nanomachine Coating','W','Reduce enemy Attack Speed.',blazeD],[10,'Bunker Drop','R','Save allies and deny burst.',blazeBunker],[13,'Collision Course','E','Reward clean engages.',blazeE],[16,'Thermal Protection','E','Armor and charge cooldown.',blazeE],[20,'Fortified Bunker','R','Upgrade the team reset.',blazeBunker]] },
    ],
  },
  {
    id:'anduin', name:'Anduin', title:'King of Stormwind', role:'Healer', universe:'Warcraft', accent:'#e3c467', trait:anduinD,
    source:'https://www.icy-veins.com/heroes/anduin-build-guide', reviewed:'July 12, 2026 · latest review',
    overview:'A backline healer with reliable burst healing, baseline rescue utility, and strong counter-engage tools.',
    abilities:[['Q','Flash Heal',anduinQ],['W','Divine Star',anduinW],['E','Chastise',anduinE],['D','Leap of Faith',anduinD]],
    builds:[
      { title:'Lightwell', subtitle:'Sustain healing', icon:anduinLightwell, summary:'Efficient long-fight healing for teams that can hold a position around an objective.', bestFor:'Sustain damage · stationary fights · objective control', gameplan:'Place Lightwell where allies can fight without abandoning it. Spread Renew with Flash Heal, then use Moral Compass attacks to refresh those effects while staying at safe range.', reminder:'Lightbomb is the default Heroic; save Salvation for drafts that cannot interrupt the channel.', talents:[[1,'Lightwell','1','Free healing in a fixed area.',anduinLightwell],[4,'Moral Compass','W','Safer range and extra attacks.',anduinW],[7,'Binding Heal','Q','Heal yourself while healing allies.',anduinQ],[10,'Lightbomb','R','Shield and area stun.',anduinLightbomb],[13,'Speed of the Pious','W','Speed and Divine Star cooldown.',anduinW],[16,'Renew','Q','Refreshable healing over time.',anduinQ],[20,"Varian's Legacy",'AA','Damage and self-sustain.',anduinD]] },
      { title:'Leap of Faith', subtitle:'Burst rescue', icon:anduinD, summary:'Sacrifices some sustain to answer crowd control, dive, and lethal burst windows.', bestFor:'Burst damage · heavy crowd control · saving divers', gameplan:'Hold Leap of Faith until enemy crowd control commits; pulling too early wastes its Unstoppable. Use Binding Heal to recover while stabilizing an ally, then keep enough distance to make both late-game pulls useful.', reminder:'At level 16, two Leap charges change fights—position far enough back to make both pulls useful.', talents:[[1,'Power Word: Shield','W','Shield allies and Anduin.',anduinW],[4,'Moral Compass','W','Contribute safely from range.',anduinW],[7,'Binding Heal','Q','Heal yourself while healing allies.',anduinQ],[10,'Lightbomb','R','Counter-engage and protection.',anduinLightbomb],[13,"Lion's Speed",'D','Speed and post-pull healing.',anduinD],[16,'Glyph of Faith','D','Gain a second rescue charge.',anduinD],[20,"Varian's Legacy",'AA','Damage and self-sustain.',anduinD]] },
    ],
  },
  {
    id:'jaina', name:'Jaina', title:'Archmage', role:'Ranged Assassin', universe:'Warcraft', accent:'#72c9ee', trait:jainaD,
    source:'https://www.icy-veins.com/heroes/jaina-build-guide', reviewed:'March 16, 2026 · balance patch',
    overview:'A combo-focused Frost Mage with exceptional burst, area control, and waveclear—but very little margin for poor positioning.',
    abilities:[['Q','Frostbolt',jainaQ],['W','Blizzard',jainaW],['E','Cone of Cold',jainaE],['D','Frostbite',jainaD]],
    builds:[
      { title:'Frostbolt', subtitle:'Single-target pressure', icon:jainaQ, summary:'Reliable sustained poke that becomes lethal once Frostbolt repeatedly connects with Chilled targets.', bestFor:'Standard games · frontline pressure · safe poke', gameplan:'Apply Chill before each Frostbolt so Ice Lance refunds cooldown and Mana. Summon Water Elemental early in the fight to keep targets Chilled, then use Icy Veins when you have room to keep casting.', reminder:'Frostbolt can pierce with Frost Shards—line up a second Hero instead of treating the frontline as a blocker.', talents:[[1,'Fingers of Frost','D','Mana regeneration and bonus damage.',jainaD],[4,'Frost Shards','Q','Frostbolt pierces two targets.',jainaQ],[7,'Ice Lance','Q','Faster Frostbolts on Chilled targets.',jainaQ],[10,'Water Elemental','R','Reliable Chill and sustained pressure.',jainaElemental],[13,'Icy Veins','1','Rapid, cheaper Basic Abilities.',jainaVeins],[16,'Northern Exposure','E','Reduce Armor for the burst window.',jainaE],[20,'Wintermute','R','Elemental mirrors Basic Abilities.',jainaElemental]] },
    ],
  },
  {
    id:'junkrat', name:'Junkrat', title:'Junker Demolitionist', role:'Ranged Assassin', universe:'Overwatch', accent:'#f3c84b', trait:junkratTrait,
    source:'https://www.icy-veins.com/heroes/junkrat-build-guide', reviewed:'September 26, 2023 · latest guide update',
    overview:'A long-range demolitionist who blankets choke points with grenades, traps divers, and displaces enemies with carefully timed mines.',
    abilities:[['Q','Frag Launcher',junkratQ],['W','Concussion Mine',junkratW],['E','Steel Trap',junkratE],['D','Total Mayhem',junkratTrait]],
    builds:[
      { title:'Steel Trap', subtitle:'Anti-dive control', icon:junkratE, summary:'Build a two-trap perimeter that roots, Silences, and exposes anyone who dives through it.', bestFor:'Dive assassins · choke points · objective control', gameplan:'Set traps before the fight starts, covering your escape route and the enemy’s likely approach. When a trap catches a Hero, trigger Blow ’Em Up! and unload RIP-Tire or a close Spread Volley during the root and Silence.', reminder:'Steel Trap takes two seconds to arm—place it where the fight will move, not where the enemy is standing now.', talents:[[1,"Blow 'Em Up!",'D','Boost damage after Mine or Trap hits.',junkratW],[4,'Chattering Teeth','E','Traps chase nearby Heroes.',junkratE],[7,'Sticky Wicket','E','Trapped Heroes are Silenced.',junkratE],[10,'RIP-Tire','R','Remote burst and displacement.',junkratTire],[13,"Gotta Trap 'Em All!",'E','Maintain two traps with less cooldown.',junkratE],[16,'Spread Volley','1','Fire two extra grenades per charge.',junkratQ],[20,'Cannonball!','Q','Greatly increase grenade radius.',junkratQ]] },
    ],
  },
  {
    id:'lucio', name:'Lúcio', title:'Freedom Fighting DJ', role:'Healer', universe:'Overwatch', accent:'#73d44f', trait:lucioD,
    source:'https://www.icy-veins.com/heroes/lucio-build-guide', reviewed:'August 24, 2026 · latest guide update',
    overview:'A highly mobile sustain Healer who accelerates rotations, disrupts engages, and saves allies with burst protection and Unstoppable.',
    abilities:[['Q','Soundwave',lucioQ],['W','Crossfade',lucioW],['E','Amp It Up',lucioE],['Z','Wall Ride',lucioD]],
    builds:[
      { title:'Advanced', subtitle:'Mobile playmaker', icon:lucioFive, summary:'Turns Wall Ride, constant attacks, and High Five into aggressive mobility, cooldown reduction, and clutch cleanses.', bestFor:'Experienced players · dive teams · active peel', gameplan:'Maintain Wall Ride for Accelerando, harass safely, and keep Basic Attacks flowing to refresh Amp It Up. High Five a safe nearby ally first when you need Unstoppable before crossing enemy control to rescue someone deeper.', reminder:'Do not chase damage at the cost of your aura—your team still needs to remain inside Crossfade.', talents:[[1,'Accelerando','Z','Ramp Wall Ride speed to 40%.',lucioD],[4,'Off the Wall','Q','Wall Ride hits refresh Soundwave.',lucioQ],[7,'Reverse Amp','1','Damage or Slow with the active track.',lucioE],[10,'High Five','R','Heal and grant Unstoppable.',lucioFive],[13,'Heavy Casters','D','Push Off briefly Stuns.',lucioD],[16,'Up the Frequency','AA','Attacks refresh Amp It Up.',lucioE],[20,'Mixing Fire','R','Upgrade High Five and add anti-heal.',lucioFive]] },
    ],
  },
  {
    id:'johanna', name:'Johanna', title:'Crusader of Zakarum', role:'Tank', universe:'Diablo', accent:'#e6c66d', trait:johannaD,
    source:'https://www.icy-veins.com/heroes/johanna-build-guide', reviewed:'July 20, 2026 · latest guide update',
    overview:'A resilient frontline anchor with superb waveclear, reliable blinds, and one of the safest initiation tools in the Nexus.',
    abilities:[['Q','Punish',johannaQ],['W','Condemn',johannaW],['E','Shield Glare',johannaE],['D','Iron Skin',johannaD]],
    builds:[
      { title:'Shield Glare', subtitle:'Reliable team protection', icon:johannaE, summary:'Frequent blinds shut down Basic Attack threats while Blessed Shield supplies a clean, ranged engage.', bestFor:'Basic Attack teams · main tank · safe initiation', gameplan:'Use Shield Glare to deny meaningful attack windows, not just for poke. Use Conviction to close distance for Condemn, then hold Blessed Shield until your team can follow the stun.', reminder:'Iron Skin prevents crowd control; activate it before crossing the enemy frontline, not after you are locked down.', talents:[[1,'Zealous Glare','E','Gain another Shield Glare charge.',johannaE],[4,'Subdue','Q','Punish applies a stronger Slow.',johannaQ],[7,'Conviction','W','Gain speed while charging Condemn.',johannaW],[10,'Blessed Shield','R','Fast ranged engage and peel.',johannaShield],[13,'Blessed Hammer','1','Create orbiting damage after abilities.',johannaW],[16,'Holy Renewal','E','Shield Glare restores Health.',johannaE],[20,'Blinded By The Light','1','Give nearby allies a large Shield.',johannaE]] },
      { title:'Basic Attacks', subtitle:'Durable brawler', icon:johannaD, summary:'Adds self-sustain and Basic Attack cooldown reduction for persistent frontline control in extended fights.', bestFor:'Long fights · mixed damage · independent frontline', gameplan:'Build Laws of Hope between fights, use Conviction to position Condemn, and weave Basic Attacks between abilities so Blessed Momentum cycles the whole kit faster.', reminder:'Your damage is gradual—stay between threats and your backline instead of chasing low-health targets.', talents:[[1,'Laws of Hope','1','On-demand percent-Health healing.',johannaD],[4,'Subdue','Q','Punish applies a stronger Slow.',johannaQ],[7,'Conviction','W','Gain speed while charging Condemn.',johannaW],[10,'Blessed Shield','R','Start or interrupt priority plays.',johannaShield],[13,'Blessed Hammer','1','Add orbiting area damage.',johannaW],[16,'Blessed Momentum','AA','Attacks reduce Basic Ability cooldowns.',johannaD],[20,'Blinded By The Light','1','Shield nearby allies against burst.',johannaE]] },
    ],
  },
  {
    id:'hogger', name:'Hogger', title:'Scourge of Elwynn', role:'Bruiser', universe:'Warcraft', accent:'#e08743', trait:hoggerD,
    source:'https://www.icy-veins.com/heroes/hogger-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A disruptive Bruiser whose Rage, terrain angles, and chaotic spins convert tight spaces into overwhelming pressure.',
    abilities:[['Q','Staggering Blow',hoggerQ],['W','Ez-Thro Dynamite',hoggerW],['E','Hogg Wild',hoggerE],['D','Loot Hoard',hoggerD]],
    builds:[
      { title:'Hoardapult Rage', subtitle:'Teamfight disruption', icon:hoggerHoard, summary:'Creates instant terrain, spreads fire, and rewards high Rage with devastating wall stuns.', bestFor:'Objective fights · tight spaces · enemy backlines', gameplan:'Hoardapult behind the enemy team, drop Loot Hoard to create an angle, then knock a target into terrain with Staggering Blow. Hogger’s Joggers and Anger Management reward disciplined Rage control.', reminder:'Headbanger needs terrain—place Loot Hoard first when the map does not provide a wall.', talents:[[1,'On The Prowl','D','Manage Rage and heal on demand.',hoggerD],[4,"Hogger's Joggers",'D','Gain speed and healing at high Rage.',hoggerD],[7,'Garbage Fire','D','Loot Hoard ignites the area.',hoggerD],[10,'Hoardapult','R','Global engage with fresh Loot Hoard.',hoggerHoard],[13,'Pummel','E','Reduce damage from Heroes hit.',hoggerE],[16,'Headbanger','Q','Wall hits deal percent damage.',hoggerQ],[20,'Anger Management','D','High Rage accelerates cooldowns.',hoggerD]] },
      { title:'Shockwave Rage', subtitle:'Frontline burst control', icon:hoggerShockwave, summary:'Trades Hoardapult mobility for a fast melee stun that chains into Staggering Blow and Headbanger.', bestFor:'Front-to-back teams · frontline kills · reliable follow-up', gameplan:'Build Rage before the engage, use Shockwave in melee range, then immediately knock the stunned target into terrain or Loot Hoard with Staggering Blow. Seeing Red accelerates the combo at high Rage.', reminder:'This is the alternative when your team wants to kill the enemy frontline first; Hoardapult remains better for diving the backline.', talents:[[1,'On The Prowl','D','Manage Rage and heal on demand.',hoggerD],[4,"Hogger's Joggers",'D','Gain speed and healing at high Rage.',hoggerD],[7,'Seeing Red','D','High Rage accelerates Basic Abilities.',hoggerD],[10,'Shockwave','R','Melee burst and Stun.',hoggerShockwave],[13,'Pummel','E','Reduce damage from Heroes hit.',hoggerE],[16,'Headbanger','Q','Wall hits deal percent damage.',hoggerQ],[20,'Anger Management','D','High Rage accelerates cooldowns.',hoggerD]] },
    ],
  },
  {
    id:'yrel', name:'Yrel', title:'Light of Hope', role:'Bruiser', universe:'Warcraft', accent:'#f1ce67', trait:yrelD,
    source:'https://www.icy-veins.com/heroes/yrel-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A durable support Bruiser who charges powerful abilities to peel, reposition enemies, and protect nearby allies.',
    abilities:[['Q','Vindication',yrelQ],['W','Righteous Hammer',yrelW],['E','Avenging Wrath',yrelE],['D','Divine Purpose',yrelD]],
    builds:[
      { title:'Vindication', subtitle:'Protective bruiser', icon:yrelQ, summary:'Adds stronger self-healing and allied Armor while Sacred Ground anchors Yrel on contested terrain.', bestFor:'Teamfights · allied carries · objective control', gameplan:'Jump onto allies with Avenging Wrath to grant Armor, then turn and Hammer threats away from them. Use Divine Purpose for an instant Vindication heal when charging is unsafe.', reminder:'Sacred Ground only protects Yrel while she remains inside it—place it where the objective forces enemies to fight.', talents:[[1,'Light of Karabor','Q','Larger Vindication and stronger healing.',yrelQ],[4,'Aegis of Light','E','Grant Armor to nearby allies.',yrelE],[7,'Righteous Momentum','W','Move quickly while charging Hammer.',yrelW],[10,'Sacred Ground','R','Hold territory with 50 Armor.',yrelGround],[13,"Velen's Chosen",'D','Basic hits build Spell Power.',yrelD],[16,"Templar's Verdict",'W','Percent damage and Armor reduction.',yrelW],[20,'Seraphim','1','Short, frequent Unstoppable.',yrelD]] },
      { title:'Righteous Hammer', subtitle:'Durable displacement', icon:yrelW, summary:'Combines early Physical Armor and mobility with repeated Hammer disruption and late-game Armor reduction.', bestFor:'Physical damage · peel · frontline disruption', gameplan:'Use Divine Steed to rotate or reposition, then charge Righteous Hammer from a flank to knock threats away from allies. Ardent Defender enables an aggressive entry when the enemy commits burst.', reminder:'Aegis of Light only protects allies—land near teammates rather than diving past them.', talents:[[1,'Dauntless','E','Gain Physical Armor after abilities.',yrelE],[4,'Aegis of Light','E','Grant Armor to nearby allies.',yrelE],[7,'Divine Steed','Z','Mount instantly with bonus speed.',yrelD],[10,'Ardent Defender','R','Convert incoming damage into healing.',yrelArdent],[13,"Velen's Chosen",'D','Basic hits build Spell Power.',yrelD],[16,"Templar's Verdict",'W','Shred durable targets.',yrelW],[20,'Seraphim','1','Short, frequent Unstoppable.',yrelD]] },
    ],
  },
  {
    id:'qhira', name:'Qhira', title:'Realmless Bounty Hunter', role:'Melee Assassin', universe:'Nexus', accent:'#db5f78', trait:qhiraD,
    source:'https://www.icy-veins.com/heroes/qhira-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A high-risk melee Assassin who stacks bleeding, swings through danger, and heals by cashing in Blood Rage at the right instant.',
    abilities:[['Q','Carnage',qhiraQ],['W','Blood Rage',qhiraW],['E','Revolving Sweep',qhiraE],['D','Grappling Hook',qhiraD]],
    builds:[
      { title:'Heavy Bleeding', subtitle:'Reliable sustain damage', icon:qhiraW, summary:'Builds Carnage pressure into strong Blood Rage healing, Armor reduction, and repeatable Grappling Hook mobility.', bestFor:'Standard games · durable teams · extended fights', gameplan:'Land Carnage’s finishing hit for Maximum Effort, apply bleed stacks, then activate Blood Rage when Healmonger can capitalize on a low-health enemy. Final Strike finishes escaping targets.', reminder:'Blood Rage healing scales with stacks—do not cash it in immediately unless the smaller heal prevents death.', talents:[[1,'Maximum Effort','Q','Carnage’s final hit Slows.',qhiraQ],[4,'Upstage','W','Gain Evasion after Blood Rage hits.',qhiraW],[7,'Healmonger','W','Heal more against low-health Heroes.',qhiraW],[10,'Final Strike','R','Long-range execute pressure.',qhiraFinal],[13,'Chainsaw','Q','Bleeding Heroes reduce Carnage cooldown.',qhiraQ],[16,'Lingering Ailment','E','Revolving Sweep reduces Armor.',qhiraE],[20,'Utility Belt','D','More Grappling Hook mobility.',qhiraD]] },
      { title:'Basic Attacks', subtitle:'Single-target pursuit', icon:qhiraD, summary:'Uses defensive Armor, sustain, and attack speed to stay attached to one priority target.', bestFor:'Isolated targets · mobile fights · enemy backlines', gameplan:'Open with Grappling Hook or Revolving Sweep, reactivate behind the target, then keep attacking while The Hunted accelerates your pressure. Final Strike secures targets that escape melee range.', reminder:'Revolving Sweep makes Qhira untargetable, but the landing point can still leave her isolated—plan the exit first.', talents:[[1,'Finishing Touch','AA','Empower attacks against low Health.',qhiraD],[4,'Your Pain, My Gain','AA','Basic Abilities grant Armor.',qhiraD],[7,'Siphoning Link','E','Revolving Sweep heals on contact.',qhiraE],[10,'Final Strike','R','Long-range execute pressure.',qhiraFinal],[13,'The Hunted','AA','Attack speed against bleeding targets.',qhiraW],[16,'Booming Kick','E','Stun enemies around your target.',qhiraE],[20,'Utility Belt','D','Hook cooldown and extra escape.',qhiraD]] },
    ],
  },
  {
    id:'falstad', name:'Falstad', title:'Wildhammer Thane', role:'Ranged Assassin', universe:'Warcraft', accent:'#70c7ea', trait:falstadTrait,
    source:'https://www.icy-veins.com/heroes/falstad-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A global Ranged Assassin who converts map pressure into timely objective arrivals and fight-winning Mighty Gusts.',
    abilities:[['Q','Hammerang',falstadQ],['W','Lightning Rod',falstadW],['E','Barrel Roll',falstadE],['Z','Flight',falstadZ]],
    builds:[
      { title:'Basic Attacks', subtitle:'Recommended sustained damage', icon:falstadTrait, summary:'The standard meta path adds safe, percent-based frontline pressure without relying on Hero-stacking quests.', bestFor:'Large maps · split pressure · durable frontlines', gameplan:'Use Hammerang to activate Secret Weapon, then spend the empowered attack window on the priority frontline target. Preserve Tailwind for Aerie Gusts and keep Mighty Gust ready to reset dives.', reminder:'This build does not need Hero stacks, making it the dependable choice when macro and split pressure limit early fights.', talents:[[1,'Frequent Flyer','AA','Attacks build speed and damage.',falstadTrait],[4,'Hammer Gains','AA','Basic Attacks restore Health.',falstadQ],[7,'Secret Weapon','Q','Hammerang empowers Basic Attacks.',falstadQ],[10,'Mighty Gust','R','Disengage or isolate enemies.',falstadGust],[13,'Sustained Winds','AA','Attacks deal percent Health damage.',falstadTrait],[16,'Aerie Gusts','D','Tailwind activates sooner.',falstadTrait],[20,'Wind Tunnel','R','Mighty Gust repeatedly pushes.',falstadGust]] },
      { title:'Hammerang', subtitle:'Ranged poke and waveclear', icon:falstadQ, summary:'Improves safe poke and area damage for grouped fights where Lightning Rod range is dangerous.', bestFor:'Grouped enemies · waveclear · long standoffs', gameplan:'Stack Gathering Storm, throw Hammerang through the frontline, and detonate BOOMerang when it overlaps multiple targets. Mighty Gust can pin enemies or reset a losing fight.', reminder:'The return path can hit twice—reposition so Hammerang crosses the target again on its way back.', talents:[[1,'Gathering Storm','Q','Stack Hammerang damage.',falstadQ],[4,'Updraft','E','Increase Barrel Roll range and Shield.',falstadE],[7,'BOOMerang','Q','Reactivate for area damage.',falstadQ],[10,'Mighty Gust','R','Control the shape of the fight.',falstadGust],[13,'Flow Rider','D','Tailwind reduces ability cooldowns.',falstadZ],[16,'Aerie Gusts','D','Tailwind activates sooner.',falstadZ],[20,'Wind Tunnel','R','Create a sustained displacement wall.',falstadGust]] },
    ],
  },
  {
    id:'sylvanas', name:'Sylvanas', title:'The Banshee Queen', role:'Ranged Assassin', universe:'Warcraft', accent:'#a879d4', trait:sylvanasD,
    source:'https://www.icy-veins.com/heroes/sylvanas-build-guide', reviewed:'March 11, 2026 · latest guide update',
    overview:'A flexible ranged carry who disables enemy structures, spreads pressure through teams, and turns good positioning into relentless damage.',
    abilities:[['Q','Withering Fire',sylvanasQ],['W','Shadow Dagger',sylvanasW],['E','Haunting Wave',sylvanasE],['D','Black Arrows',sylvanasD]],
    builds:[
      { title:'Sustained Damage', subtitle:'Shadow Dagger pressure', icon:sylvanasW, summary:'Spreads Shadow Dagger through clustered teams and converts the marks into repeatable ranged pressure.', bestFor:'Standard games · grouped fights · steady pressure', gameplan:'Use Haunting Arrows to spread Shadow Dagger, attack marked targets to trigger Lost Soul, and use Mind Control when your team can punish the forced movement. Remorseless extends your safe attack range.', reminder:'Black Arrows is an active—turn it on for a coordinated structure push rather than leaving it unused.', talents:[[1,'Unrelenting Torment','W','Shadow Dagger deals more damage.',sylvanasW],[4,'Haunting Arrows','E','Haunting Wave spreads Shadow Dagger.',sylvanasE],[7,'Lost Soul','W','Attacks reduce Dagger cooldown.',sylvanasW],[10,'Mind Control','R','Force a target out of position.',sylvanasMind],[13,'Remorseless','AA','Attacks gain range and spread Curse.',sylvanasD],[16,'Evasive Fire','Q','Withering Fire grants speed.',sylvanasQ],[20,'Withering Barrage','Q','Gain another Withering Fire charge.',sylvanasQ]] },
      { title:'Burst', subtitle:'Advanced dive execution', icon:sylvanasArrow, summary:'Uses Haunting Wave resets and a Wailing Arrow silence to deliver a dangerous but explosive close-range sequence.', bestFor:'Advanced players · pick comps · vulnerable backlines', gameplan:'Stack the target first, cast Haunting Wave through them, reactivate only when enemy control is committed, then unload Withering Fire and Wailing Arrow. Windrunner gives a second Wave to leave.', reminder:'Haunting Wave is your only real escape—diving without Windrunner’s reset is usually a one-way trip.', talents:[[1,'Unrelenting Torment','W','Shadow Dagger deals more damage.',sylvanasW],[4,'Unstable Poison','D','Marked minions explode on death.',sylvanasD],[7,'Festering Wounds','E','Wave applies full Curse stacks.',sylvanasE],[10,'Wailing Arrow','R','Burst damage and area Silence.',sylvanasArrow],[13,'Windrunner','E','Haunting Wave resets after teleport.',sylvanasE],[16,'Will of the Forsaken','1','Cleanse and gain Movement Speed.',sylvanasD],[20,'Bolt of the Storm','1','Blink for engage or escape.',sylvanasE]] },
    ],
  },
  {
    id:'brightwing', name:'Brightwing', title:'Faerie Dragon', role:'Healer', universe:'Warcraft', accent:'#67d7a2', trait:brightwingD,
    source:'https://www.icy-veins.com/heroes/brightwing-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A global Healer who passively sustains nearby allies, neutralizes divers with Polymorph, and teleports to emergencies.',
    abilities:[['Q','Arcane Flare',brightwingQ],['W','Polymorph',brightwingW],['E','Pixie Dust',brightwingE],['D','Soothing Mist',brightwingD]],
    builds:[
      { title:'Critical Mist', subtitle:'Cleanse and sustain', icon:brightwingZ, summary:'Adds a strong area cleanse to Soothing Mist while preserving Brightwing’s global healing and defensive utility.', bestFor:'Heavy crowd control · grouped teams · standard play', gameplan:'Stay near multiple allies for Soothing Mist, but keep enough distance to avoid shared crowd control. Use Critical Mist after disabling effects land, then Polymorph the diver trying to continue the engage.', reminder:'Phase Shift is a long channel—start early and check that the destination ally is not retreating into danger.', talents:[[1,'Hyper Shift','Z','Soothing Mist reduces Phase Shift.',brightwingZ],[4,'Magic Spit','AA','Attacks improve Soothing Mist.',brightwingQ],[7,'Critical Mist','D','Cleanse nearby allies and heal.',brightwingZ],[10,'Blink Heal','R','Mobile burst healing.',brightwingBlink],[13,'Safety Dust','E','Pixie Dust boosts healing received.',brightwingE],[16,'Critterize','W','Polymorph reduces target Armor.',brightwingW],[20,'Invisible Friends','R','Blink Heal grants Stealth.',brightwingBlink]] },
      { title:'Teleport', subtitle:'Global rescue', icon:brightwingZ, summary:'Strengthens Phase Shift into a frequent defensive arrival while Polymorph punishes enemies clustered around the target.', bestFor:'Large maps · split pressure · isolated allies', gameplan:'Watch allied Health bars while soaking safely, then Phase Shift before an ally becomes critically low. Peekaboo reveals the arrival area and grants both of you protection against the opening burst.', reminder:'Do not teleport merely to top off Health—save Phase Shift for pressure your passive aura cannot answer.', talents:[[1,'Hyper Shift','Z','Reduce global cooldown through healing.',brightwingZ],[4,'Unstable Anomaly','W','Polymorph explodes when it ends.',brightwingW],[7,'Peekaboo!','Z','Reveal and Shield on arrival.',brightwingZ],[10,'Blink Heal','R','Reposition while healing allies.',brightwingBlink],[13,'Safety Dust','E','Amplify healing on a protected ally.',brightwingE],[16,'Critterize','W','Help the team burst a threat.',brightwingW],[20,'Invisible Friends','R','Protect Blink Heal targets.',brightwingBlink]] },
    ],
  },
  {
    id:'rehgar', name:'Rehgar', title:'Shaman of the Earthen Ring', role:'Healer', universe:'Warcraft', accent:'#5ebee3', trait:rehgarD,
    source:'https://www.icy-veins.com/heroes/rehgar-build-guide', reviewed:'January 27, 2026 · latest guide review',
    overview:'An aggressive melee Healer with strong camp clear, reliable slowing, and a massive single-target Ancestral Healing save.',
    abilities:[['Q','Chain Heal',rehgarQ],['W','Lightning Shield',rehgarW],['E','Earthbind Totem',rehgarE],['Z','Ghost Wolf',rehgarD]],
    builds:[
      { title:'Earthbind Totem', subtitle:'Control and protection', icon:rehgarE, summary:'Turns Earthbind Totem into a large zone that slows enemies, reduces their damage, and sets up team healing.', bestFor:'Dive defense · narrow objectives · team protection', gameplan:'Place Earthbind Totem just behind the target so retreat carries them deeper into the slow. Use Ancestral Healing before an ally reaches critical Health because the heal has a one-second delay.', reminder:'Rehgar can clear camps efficiently—use that advantage between objectives, not while your team needs healing.', talents:[[1,'Colossal Totem','E','Increase Totem area and range.',rehgarE],[4,'Earthliving Enchant','Q','Heal low-health allies over time.',rehgarQ],[7,'Grounded Totem','E','Reduce enemy damage and Attack Speed.',rehgarE],[10,'Ancestral Healing','R','Huge delayed single-target heal.',rehgarAncestral],[13,'Tidal Waves','Q','Chain Heal reduces its cooldown.',rehgarQ],[16,'Earthgrasp Totem','E','Apply a strong opening Slow.',rehgarE],[20,"Farseer's Blessing",'R','Ancestral Healing affects the team.',rehgarAncestral]] },
      { title:'Lightning Shield', subtitle:'Aggressive sustain', icon:rehgarW, summary:'Rewards placing Lightning Shield on an active frontline Hero and grows into strong sustained teamfight damage.', bestFor:'Melee-heavy teams · camps · long brawls', gameplan:'Cast Lightning Shield on the ally who will remain in melee range, use Ghost Wolf attacks to trigger Blood and Thunder, and refresh the Shield once Rising Storm has accumulated.', reminder:'Lightning Shield generates more value on an allied diver than on Rehgar when you must stay back to heal.', talents:[[1,'Stormcaller','W','Lightning Shield returns Mana.',rehgarW],[4,'Electric Charge','W','Larger Shield radius and healing.',rehgarW],[7,'Blood and Thunder','Z','Wolf attacks reduce Basic cooldowns.',rehgarD],[10,'Ancestral Healing','R','Save the focused ally.',rehgarAncestral],[13,'Earth Shield','W','Lightning Shield protects its target.',rehgarW],[16,'Rising Storm','W','Repeated Shields scale damage.',rehgarW],[20,"Farseer's Blessing",'R','Add area healing to the save.',rehgarAncestral]] },
    ],
  },
  {
    id:'mephisto', name:'Mephisto', title:'Lord of Hatred', role:'Ranged Assassin', universe:'Diablo', accent:'#9b77ee', trait:mephistoD,
    source:'https://www.icy-veins.com/heroes/mephisto-build-guide', reviewed:'September 11, 2026 · latest talent review',
    overview:'An area-damage mage who uses temporary Shade teleports and repeated Hero hits to reset cooldowns at remarkable speed.',
    abilities:[['Q','Skull Missile',mephistoQ],['W','Lightning Nova',mephistoW],['E','Shade of Mephisto',mephistoE],['D','Lord of Hatred',mephistoD]],
    builds:[
      { title:'Skull Missile', subtitle:'Repeatable spell burst', icon:mephistoQ, summary:'Stacks Skull Missile into a two-charge threat and detonates it through Lightning Nova for heavy area damage.', bestFor:'Grouped fights · allied setup · safe poke', gameplan:'Launch Skull Missile at slowed or rooted enemies, then position Lightning Nova so the missile crosses its ring for Lightning Reaction. Durance becomes a powerful Silence with Unspeakable Horror.', reminder:'Everyone can see where Shade returns—never leave its origin inside enemy crowd control or displacement.', talents:[[1,'Unyielding Power','Q','Stack damage and gain a second charge.',mephistoQ],[4,'Spite','D','Globes accelerate cooldown resets.',mephistoD],[7,'Trickery','E','Speed and potential Shade reset.',mephistoE],[10,'Durance of Hate','R','Root one target and nearby enemies.',mephistoDurance],[13,'Abhorred Skull','Q','Skull Missile grants Spell Power.',mephistoQ],[16,'Lightning Reaction','Q','Missiles explode through Nova.',mephistoQ],[20,'Unspeakable Horror','R','Durance also Silences enemies.',mephistoDurance]] },
      { title:'Standard Lightning Nova', subtitle:'Percent-damage brawler', icon:mephistoW, summary:'Punishes high-health, grouped Heroes with overlapping Novas, defensive shielding, and frequent cooldown resets.', bestFor:'High-health teams · clustered objectives · sustained fights', gameplan:'Shade to the edge of a grouped fight and keep enemies on Lightning Nova’s outer ring. Basic Attacks with Shard of Hate accelerate cooldowns before Mimic doubles your Nova coverage.', reminder:'Lightning Nova deals damage at its ring, not inside it—match your movement to the target’s path.', talents:[[1,'Furious Spark','W','Every third Nova hit deals bonus damage.',mephistoW],[4,'Static Barrier','W','Nova damage becomes a Shield.',mephistoW],[7,'Trickery','E','Speed and potential Shade reset.',mephistoE],[10,'Durance of Hate','R','Hold enemies on the Nova ring.',mephistoDurance],[13,'Shard of Hate','AA','Attacks splash and reduce cooldowns.',mephistoD],[16,'Static Field','W','Nova deals percent Health damage.',mephistoW],[20,'Mimic','E','Overlap Novas from both positions.',mephistoE]] },
    ],
  },
  {
    id:'auriel', name:'Auriel', title:'Archangel of Hope', role:'Healer', universe:'Diablo', accent:'#f1c762', trait:aurielD,
    source:'https://www.icy-veins.com/heroes/auriel-build-guide', reviewed:'September 11, 2026 · latest guide update',
    overview:'A resource-driven Healer who turns allied damage into Energy, enabling powerful burst healing without using Mana.',
    abilities:[['Q','Sacred Sweep',aurielQ],['W','Ray of Heaven',aurielW],['E','Detainment Strike',aurielE],['D','Bestow Hope',aurielD]],
    builds:[
      { title:'Detainment Strike', subtitle:'Wall-stun control', icon:aurielE, summary:'Adds stacking Detainment Strike damage and a blind while preserving Auriel’s reliable Energy economy and burst healing.', bestFor:'Maps with walls · allied follow-up · standard games', gameplan:'Keep Bestow Hope on the most reliable damage dealer, then angle Detainment Strike so the target collides with terrain. Crystal Aegis buys time for Ray of Heaven to refill.', reminder:'Detainment Strike only stuns on terrain collision—approach from an angle that puts a wall behind the target.', talents:[[1,'Searing Light','W','Ray of Heaven also damages enemies.',aurielW],[4,'Repeated Offense','E','Wall stuns stack Strike damage.',aurielE],[7,'Energized Cord','AA','Attacks generate more Energy.',aurielD],[10,'Crystal Aegis','R','Put an ally in protective Stasis.',aurielAegis],[13,'Blinding Flash','Q','Center hits Blind enemy Heroes.',aurielQ],[16,'Reservoir of Hope','W','Full heals grow maximum Energy.',aurielW],[20,'Shield of Hope','1','Shield allies by missing Health.',aurielD]] },
      { title:'Sacred Sweep', subtitle:'Frequent area control', icon:aurielQ, summary:'Widens Sacred Sweep, reduces its cooldown, and pulls targets toward the center for repeatable Energy generation.', bestFor:'Grouped enemies · waveclear · frequent skirmishes', gameplan:'Use Majestic Span to catch multiple Heroes in the center of Sacred Sweep. Converging Force groups them for allied damage while Energized Cord fills gaps in your Energy generation.', reminder:'A full Energy bar does nothing by itself—spend it before incoming damage forces an inefficient emergency heal.', talents:[[1,'Righteous Assault','Q','Hero hits reduce Sweep cooldown.',aurielQ],[4,'Majestic Span','Q','Increase Sacred Sweep radius.',aurielQ],[7,'Energized Cord','AA','Attacks generate more Energy.',aurielD],[10,'Crystal Aegis','R','Put an ally in protective Stasis.',aurielAegis],[13,'Converging Force','Q','Pull enemies toward Sweep’s center.',aurielQ],[16,'Reservoir of Hope','W','Full heals grow maximum Energy.',aurielW],[20,'Shield of Hope','1','Shield allies by missing Health.',aurielD]] },
    ],
  },
]

const PADDED_ICON_NAMES = ['_hexagon', 'junkrat-', 'lucio-']

function iconClassName(image, className = '') {
  const isPadded = PADDED_ICON_NAMES.some(name => image.includes(name))
  return `${className}${isPadded ? ' hots-icon-padded' : ''}`.trim()
}

function HeroNav({ activeHero, onSelect }) {
  return <nav className="hots-hero-nav" aria-label="Choose a hero">{HEROES.map(hero => <button key={hero.id} className={activeHero === hero.id ? 'is-active' : ''} style={{'--hero-accent':hero.accent}} onClick={() => onSelect(hero.id)}><img className={iconClassName(hero.trait)} src={hero.trait} alt="" /><span><strong>{hero.name}</strong><small>{hero.role}</small></span></button>)}</nav>
}

function BuildCard({ build, accent }) {
  return <article className="hots-build" style={{'--build-accent':accent}}><header className="hots-build-header"><img className={iconClassName(build.icon)} src={build.icon} alt="" /><div><p>{build.subtitle}</p><h3>{build.title}</h3></div></header><p className="hots-build-summary">{build.summary}</p><p className="hots-best-for"><span>Best for</span>{build.bestFor}</p><ol className="hots-talents" aria-label={`${build.title} talent order`}>{build.talents.map(([level,name,key,note,image]) => <li className="hots-talent" key={level}><span className="hots-level">{level}</span><img className={iconClassName(image)} src={image} alt="" /><span className="hots-talent-copy"><strong>{name}<kbd>{key}</kbd></strong><small>{note}</small></span></li>)}</ol><div className="hots-plan"><span>How to play it</span><p>{build.gameplan}</p></div><p className="hots-reminder"><strong>Remember</strong>{build.reminder}</p></article>
}

export default function HeroesOfTheStorm() {
  const [activeId,setActiveId] = useState('valla')
  const hero = HEROES.find(item => item.id === activeId) ?? HEROES[0]
  return <div className="hots-shell" style={{'--hero-accent':hero.accent}}><HeroNav activeHero={hero.id} onSelect={setActiveId} /><section className="hots-guide"><header className="hots-hero-header"><img className={iconClassName(hero.trait, 'hots-portrait')} src={hero.trait} alt={`${hero.name} trait icon`} /><div><p className="hots-kicker">{hero.universe} · {hero.role}</p><h2>{hero.name}</h2><p className="hots-hero-title">{hero.title}</p><p className="hots-overview">{hero.overview}</p></div><div className="hots-abilities" aria-label={`${hero.name} basic abilities`}>{hero.abilities.map(([key,name,image]) => <span key={key}><img className={iconClassName(image)} src={image} alt="" /><kbd>{key}</kbd><small>{name}</small></span>)}</div><a href={hero.source} target="_blank" rel="noreferrer" className="hots-source">Icy Veins source ↗</a></header><div className="hots-build-grid">{hero.builds.map(build => <BuildCard key={build.title} build={build} accent={hero.accent} />)}</div><footer className="hots-guide-footer"><span>Source reviewed {hero.reviewed}</span><span>Game artwork © Blizzard Entertainment · personal reference guide</span></footer></section></div>
}
