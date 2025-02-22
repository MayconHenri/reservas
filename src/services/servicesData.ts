export interface Service {
  category: string;
  name: string;
  price: number;
  time: number;
}

export const services: Service[] = [
  { category: "Combos", name: "Degradê + Barba", price: 25, time: 60 },
  { category: "Combos", name: "Social + Barba", price: 20, time: 45 },
  { category: "Serviços", name: "Sobrancelha", price: 5, time: 30 },
  { category: "Serviços", name: "Pezinho", price: 5, time: 20 },
  { category: "Serviços", name: "Pigmentação", price: 5, time: 60 },
  { category: "Serviços", name: "Barba", price: 10, time: 30 },
  { category: "Serviços", name: "Finalização Dedoliss", price: 10, time: 40 },
  { category: "Serviços", name: "Social Máquina", price: 10, time: 25 },
  { category: "Serviços", name: "Social Máquina Tesoura", price: 15, time: 40 },
  { category: "Serviços", name: "Tesoura", price: 15, time: 35 },
  { category: "Serviços", name: "Degradê", price: 20, time: 50 },
  { category: "Serviços", name: "Luzes", price: 50, time: 90 },
  { category: "Serviços", name: "Nevou", price: 60, time: 60 },
  { category: "Planos", name: "2 Degradê no mês", price: 30, time: 40 },
  { category: "Planos", name: "2 Degradê + Barba", price: 50, time: 50 },
  { category: "Planos", name: "4 Degradê no mês", price: 70, time: 80 },
  { category: "Planos", name: "2 Social Máquina Tesoura no mês", price: 20, time: 50 },
  { category: "Planos", name: "4 Social Máquina Tesoura no mês", price: 50, time: 100 },
  { category: "Planos", name: "2 Degradê + Pigmentação no mês", price: 40, time: 70 },
  { category: "Planos", name: "4 Degradê + Pigmentação no mês", price: 100, time: 120 },
];
