import random

class Road:
    def __init__(self, road_id, max_capacity, turn_probabilities, average_travel_time=1):
        self.road_id = road_id
        self.max_capacity = max_capacity
        self.current_capacity = 0
        self.turn_probabilities = turn_probabilities
        self.average_travel_time = average_travel_time
        self.moving_cars = 0

    def add_cars(self, num_to_add):
        self.current_capacity = min(self.current_capacity + num_to_add, self.max_capacity)
        print(f"Road {self.road_id} added {num_to_add} cars. Current capacity: {self.current_capacity}")

    def remove_cars(self, num_to_remove):
        self.current_capacity = max(self.current_capacity - num_to_remove, 0)

    def get_congestion(self):
        return self.current_capacity / self.max_capacity

    def get_state(self):
        return {
            "road_id": self.road_id,
            "current_capacity": self.current_capacity,
            "max_capacity": self.max_capacity,
            "congestion": self.get_congestion()
        }

    def time_step(self, current_time):
        if current_time % self.average_travel_time == 0 and self.current_capacity > 0:
        
            cars_to_move = min(self.current_capacity, int(10 / self.average_travel_time) + 1) #more cars move when travel time is less congestion
            self.remove_cars(cars_to_move)
            self.moving_cars += cars_to_move
        if self.moving_cars > 0 and current_time % self.average_travel_time == 0:
            cars_arriving = self.moving_cars
            self.moving_cars = 0
            return cars_arriving
        return 0

class Intersection:
    def __init__(self, intersection_id):
        self.intersection_id = intersection_id
        self.incoming_roads = {}
        self.light_states = {}
        self.green_light_times = {}
        self.red_light_times = {}

    def add_incoming_road(self, road):
        self.incoming_roads[road.road_id] = road
        self.light_states[road.road_id] = "red"
        self.green_light_times[road.road_id] = 5
        self.red_light_times[road.road_id] = 10

    def change_light_time(self, average_congestion):
        for road_id, road in self.incoming_roads.items():
            congestion = road.get_congestion()
            diff = congestion - average_congestion
            if diff > 0.1:
                self.green_light_times[road_id] = min(self.green_light_times[road_id] + 1, 15) #increment green light time
            elif diff < -0.1:
                self.green_light_times[road_id] = max(self.green_light_times[road_id] - 1, 3) #decrement green light time
            self.red_light_times[road_id] = 15 - self.green_light_times[road_id]
            
    def distribute_traffic(self, current_time):
        for road_id, road in self.incoming_roads.items():
            if self.light_states[road_id] == "green":
                num_cars = min(road.current_capacity, 3)
                print(f"Road {road.road_id} turn_probabilities: {road.turn_probabilities}")
                if road.turn_probabilities: 
                    next_road = random.choice(list(road.turn_probabilities.keys())) 
                    next_road.add_cars(num_cars)
                    road.remove_cars(num_cars)

                if (current_time % (self.green_light_times[road_id] + self.red_light_times[road_id])) >= self.green_light_times[road_id]:
                    self.light_states[road_id] = "red"
            else:
                if (current_time % (self.green_light_times[road_id] + self.red_light_times[road_id])) == 0:
                    self.light_states[road_id] = "green"
                    
    def adjust_light_times(self):
        for road_id, road in self.incoming_roads.items():
            congestion = road.current_capacity / road.max_capacity
            self.green_light_times[road_id] = max(1, int(10 * congestion))

    def get_state(self):
        return {
            "intersection_id": self.intersection_id,
            "incoming_roads": [road.get_state() for road in self.incoming_roads.values()],
        }


class TrafficGraph:
    def __init__(self):
        self.intersections = {}
        self.roads = {}
        self.current_time = 0

    def add_intersection(self, intersection):
        self.intersections[intersection.intersection_id] = intersection

    def calculate_travel_time(self, max_capacity, current_capacity=0):
        if max_capacity != 0:
            congestion = current_capacity / max_capacity
        else:
            congestion = 0
        return max(1, int(10 * (1 - congestion))) #Higher congestion, longer travel time

    def add_road(self, road_id, intersection1, intersection2, max_capacity, turn_probabilities, reverse_turn_probabilities=None):
        average_travel_time = self.calculate_travel_time(max_capacity, 0) 

        road = Road(road_id, max_capacity, {}, average_travel_time)
        self.roads[road_id] = road
        intersection1.add_incoming_road(road)
        intersection2.add_incoming_road(road)

        if reverse_turn_probabilities is None:
            reverse_turn_probabilities = {}

        reverse_road = Road(f"{road_id}_rev", max_capacity, {}, average_travel_time)
        self.roads[f"{road_id}_rev"] = reverse_road
        intersection2.add_incoming_road(reverse_road)
        intersection1.add_incoming_road(reverse_road)

        # Update turn probabilities to store Road objects
        for source_road_id, probs in turn_probabilities.items():
            source_road = self.roads[source_road_id]
            source_road.turn_probabilities = {}
            total_prob = 0
            for dest_road_id, prob in probs.items():
                source_road.turn_probabilities[self.roads[dest_road_id]] = prob
                total_prob += prob
            if total_prob != 1:
                print(f"Warning: Turn probabilities for {source_road_id} do not sum to 1.")
        
    def simulate_step(self):
        before_optimization = self.get_state()
        total_congestion = 0
        total_roads = 0
        for intersection in self.intersections.values():
            for road in intersection.incoming_roads.values():
                total_congestion += road.get_congestion()
                total_roads += 1
        average_congestion = total_congestion / total_roads if total_roads > 0 else 0

        for intersection in self.intersections.values():
            intersection.change_light_time(average_congestion)
            intersection.distribute_traffic(self.current_time)

        after_optimization = self.get_state()
        self.print_congestion_changes(before_optimization, after_optimization)
        print(f"Average Congestion: {average_congestion:.2f}") #print the average congestion.
        self.current_time += 1

    def print_congestion_changes(self, before, after):
        print("\nTraffic Update:")
        for idx, (intersection_id, data) in enumerate(before.items(), start=1):
            print(f"\nIntersection {idx} ({intersection_id}):")
            for before_road, after_road in zip(data["incoming_roads"], after[intersection_id]["incoming_roads"]): # Change here
                road_id = before_road["road_id"]
                print(f"  Before Optimization: {road_id} congestion: {before_road['congestion']:.2f}")
                print(f"  After Optimization:  {road_id} congestion: {after_road['congestion']:.2f}")
                
    def get_state(self):
        return {i_id: i.get_state() for i_id, i in self.intersections.items()}

traffic_graph = TrafficGraph()
intersection_A = Intersection("A")
intersection_B = Intersection("B")
intersection_C = Intersection("C")

traffic_graph.add_intersection(intersection_A)
traffic_graph.add_intersection(intersection_B)
traffic_graph.add_intersection(intersection_C)

intersection_A.traffic_graph = traffic_graph
intersection_B.traffic_graph = traffic_graph
intersection_C.traffic_graph = traffic_graph

traffic_graph.add_road("AB", intersection_A, intersection_B, 50, {})
traffic_graph.add_road("BA", intersection_B, intersection_A, 50, {})
traffic_graph.add_road("BC", intersection_B, intersection_C, 40, {})
traffic_graph.add_road("CB", intersection_C, intersection_B, 40, {})
traffic_graph.add_road("CA", intersection_C, intersection_A, 60, {})
traffic_graph.add_road("AC", intersection_A, intersection_C, 60, {})

traffic_graph.roads["AB"].turn_probabilities = {
    traffic_graph.roads["BA"]: 0.7,
    traffic_graph.roads["BC"]: 0.3
}
traffic_graph.roads["BC"].turn_probabilities = {
    traffic_graph.roads["CB"]: 0.6,
    traffic_graph.roads["AC"]: 0.4
}
traffic_graph.roads["CA"].turn_probabilities = {
    traffic_graph.roads["AC"]: 0.5,
    traffic_graph.roads["AB"]: 0.5
}
traffic_graph.roads["BA"].turn_probabilities = {
    traffic_graph.roads["AB"]: 0.7,
    traffic_graph.roads["CB"]: 0.3
}
traffic_graph.roads["CB"].turn_probabilities = {
    traffic_graph.roads["BC"]: 0.6,
    traffic_graph.roads["CA"]: 0.4
}
traffic_graph.roads["AC"].turn_probabilities = {
    traffic_graph.roads["CA"]: 0.5,
    traffic_graph.roads["BC"]: 0.5
}

traffic_graph.roads["AB"].add_cars(30)
traffic_graph.roads["BC"].add_cars(20)
traffic_graph.roads["CA"].add_cars(10)
traffic_graph.roads["BA"].add_cars(25)
traffic_graph.roads["CB"].add_cars(15)
traffic_graph.roads["AC"].add_cars(5)

for road in traffic_graph.roads.values():
    road.average_travel_time = traffic_graph.calculate_travel_time(road.max_capacity, road.current_capacity)

for step in range(5):
    print(f"\n--- Simulation Step {step + 1} ---")
    traffic_graph.simulate_step()