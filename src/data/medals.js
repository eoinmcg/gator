import { NewgroundsMedal } from "../lib/newgrounds";

let medalData = [
  {
    name: 'Keen',
    info: 'Complete the tutorial',
    icon: '🎓',
    id: 0
  },
  {
    name: 'Speedy',
    info: 'Complete a mission faster than 2:45',
    icon: '⚡',
    id: 1
  },
  {
    name: 'Pacifist',
    info: 'Finish Mission 3 without a single kill',
    icon: '☮️',
    id: 2
  },
  {
    name: 'Killer',
    info: 'Kill all baddies on Mission 4',
    icon: '💀',
    id: 3
  },
  {
    name: 'Hero',
    info: 'Finish all Missions',
    icon: '🦸',
    id: 4
  },
  {
    name: 'Hawt',
    info: 'Go for a swim in lava',
    icon: '🔥',
    id: 5
  },
  {
    name: 'NomNom!',
    info: 'Eat the donut on Mission 5',
    icon: '🍩',
    id: 5
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
