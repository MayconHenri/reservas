import { Service, services } from "./servicesData";

export const getFilteredServices = (searchQuery: string, selectedTags: string[]) => {
  return {
    servicos: services
      .filter(service =>
        (selectedTags.length === 0 || selectedTags.includes(service.category)) &&
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(service => service.category === "Serviços"),

    planos: services
      .filter(service =>
        (selectedTags.length === 0 || selectedTags.includes(service.category)) &&
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(service => service.category === "Planos"),

    combos: services
      .filter(service =>
        (selectedTags.length === 0 || selectedTags.includes(service.category)) &&
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(service => service.category === "Combos"),
  };
};

export const getPopularServices = () => {
  const popularNames = ["Degradê + Barba", "Social + Barba", "Luzes"];
  return services.filter(service => popularNames.includes(service.name));
};

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};
