import { NewgroundsMedal } from "../lib/newgrounds";

let medalData = [
  {
    name: 'Keen',
    info: 'Complete the tutorial',
    icon: '🎓',
    id: 82319
  },
  {
    name: 'Speedy',
    info: 'Finish faster than 2:45',
    icon: '⚡',
    id: 82320
  },
  {
    name: 'Pacifist',
    info: 'Finish Mission 3 without killing',
    icon: '☮️',
    id: 82322
  },
  {
    name: 'Killer',
    info: 'Kill all baddies on Mission 4',
    icon: '💀',
    id: 82321
  },
  {
    name: 'Hero',
    info: 'Finish all Missions',
    icon: '🦸',
    id: 82324
  },
  {
    name: 'Hawt',
    info: 'Go for a swim in lava',
    icon: '🔥',
    id: 82323
  },
  {
    name: 'NomNom!',
    info: 'Eat the donut on Mission 5',
    icon: '🍩',
    id: 82325
  },
];


export default function generateMedals(gameTitle, g) {
  const medals = [];
  medalData.forEach((medal, i) => {
    medals.push(new NewgroundsMedal(i, medal.name, medal.info, medal.icon, false, g, medal.id));
  });
  medalsInit(gameTitle);
  return medals;
}

