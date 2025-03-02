import random
from copy import deepcopy
import numpy as np
from skopt import gp_minimize
from skopt.space import Integer
from skopt.utils import use_named_args
import csv
import ast

print("Starting the optimization process...")

class Road:
    def __init__(self, direction, road_id, max_capacity, edge_data):
        self.direction = direction
        self.road_id = road_id
        self.max_capacity = max_capacity
        self.edge_data = edge_data
        
        self.current_capacity = random.randint(max_capacity // 2, (max_capacity // 5) * 4)
        self.capacity_memory = self.current_capacity
        self.congestion = 0
        self.intersection_parent_name = ""
    
    def reset_road(self):
        self.current_capacity = self.capacity_memory

    def add_car_to_road(self, num_to_add = 1):
        if (self.current_capacity < self.max_capacity):
            self.current_capacity += num_to_add
            return True
        else:
            return False

    def remove_car_from_road(self, num_to_remove = 1):
        if (self.current_capacity > 0):
            self.current_capacity -= num_to_remove
            return True
        else:
            return False
        
    def calculate_congestion(self):
        self.congestion = self.current_capacity / self.max_capacity

    def get_congestion(self):
        return self.congestion
    
    def get_road_id(self):
        return self.road_id
    
    def get_road_direction(self):
        return self.direction
    
    def get_max_capacity(self):
        return self.max_capacity

    def get_current_capacity(self):
        return self.current_capacity

    def get_edge_data(self):
        return self.edge_data

    def get_state(self):
        state = []
        state.append(self.direction)
    
    def set_intersection_parent(self, parent_id):
        self.intersection_parent_name = parent_id

class Intersection:
    def __init__(self, time_of_day, intersection_id, traffic_input, traffic_output, traffic_light):
        self.intersection_id = intersection_id
        self.time_of_day = time_of_day

        self.traffic_input = traffic_input      #incoming traffic
        self.traffic_output = traffic_output    #outgoing traffic
        self.time_queue_a = 0
        self.time_queue_b = 0
        self.current_light_a = None
        self.current_light_b = None

        self.traffic_light = deepcopy(traffic_light)
        self.traffic_light_state = 0
        self.traffic_light_index = 0

        self.edges = []                #list of roads connected to this intersection

    def set_road_input_to_intersection(self):
        for road in self.traffic_input:
            road.set_intersection_parent(self.intersection_id) 

    def get_intersection_id(self):
        return self.intersection_id

    def get_queue_time_a(self):
        return self.time_queue_a
    
    def get_queue_time_b(self):
        return self.time_queue_b

    def get_traffic_input(self):
        return self.traffic_input
    
    def get_traffic_output(self):
        return self.traffic_output

    def get_traffic_light(self):
        return self.traffic_light
    
    def get_traffic_light_index(self):
        return self.traffic_light_index
    
    def reset_traffic_light_index(self):
        self.traffic_light_index = 0

    def increment_traffic_light_index(self):
        self.traffic_light_index += 1

    def decrement_queue_time(self):
        self.time_queue_a -= 1
        self.time_queue_b -= 1
    
    def queue_a_is_zero(self):
        return (self.time_queue_a == 0)
    
    def queue_b_is_zero(self):
        return (self.time_queue_b == 0)
    
    def set_queue_a_time(self, time):
        self.time_queue_a = time
    
    def set_queue_b_time(self, time):
        self.time_queue_b = time

    def set_current_light_a(self, light):
        self.current_light_a = light
    
    def set_current_light_b(self, light):
        self.current_light_b = light

    def get_current_light_a(self):
        return self.current_light_a
    
    def get_current_light_b(self):
        return self.current_light_b

    def add_edge(self, road):
        self.edges.append(road)

    def get_current_light_state(self):
        return self.traffic_light_state
    
    def swap_current_light_state(self):
        if self.traffic_light_state == 0:
            self.traffic_light_state = 1
        else:
            self.traffic_light_state = 0


    def get_state(self):
        state = []
        state.append(self.time_of_day)
        state.append(self.intersection_id)
        state.append(self.traffic_input)
        state.append(self.traffic_output)
        state.append(self.edges)
        return state

roadn1 = Road("N","roadn1", 50, [0.7, 0.2, 0.0, 0.1])
roadn2 = Road("N","roadn2", 50, [0.7, 0.2, 0.0, 0.1])
roadn3 = Road("N","roadn3", 50, [0.7, 0.2, 0.0, 0.1])
roadn4 = Road("N","roadn4", 50, [0.7, 0.2, 0.0, 0.1])
roadn5 = Road("N","roadn5", 50, [0.7, 0.2, 0.0, 0.1])
roadn6 = Road("N","roadn6", 50, [0.7, 0.1, 0.0, 0.2])
roads1 = Road("S","roads1", 50, [0.0, 0.1, 0.7, 0.2])
roads2 = Road("S","roads2", 50, [0.0, 0.1, 0.7, 0.2])
roads3 = Road("S","roads3", 50, [0.0, 0.1, 0.7, 0.2])
roads4 = Road("S","roads4", 50, [0.0, 0.1, 0.7, 0.2])
roads5 = Road("S","roads5", 50, [0.0, 0.1, 0.7, 0.2])
roads6 = Road("S","roads6", 50, [0.0, 0.1, 0.7, 0.2])
roade1 = Road("E","roade1", 50, [0.2, 0.7, 0.1, 0.0])
roade2 = Road("E","roade2", 50, [0.2, 0.7, 0.1, 0.0])
roade3 = Road("E","roade3", 50, [0.2, 0.7, 0.1, 0.0])
roade4 = Road("E","roade4", 50, [0.2, 0.7, 0.1, 0.0])
roade5 = Road("E","roade5", 50, [0.2, 0.7, 0.1, 0.0])
roade6 = Road("E","roade6", 50, [0.2, 0.7, 0.1, 0.0])
roadw1 = Road("W","roadw1", 50, [0.1, 0.0, 0.2, 0.7])
roadw2 = Road("W","roadw2", 50, [0.1, 0.0, 0.2, 0.7])
roadw3 = Road("W","roadw3", 50, [0.1, 0.0, 0.2, 0.7])
roadw4 = Road("W","roadw4", 50, [0.1, 0.0, 0.2, 0.7])
roadw5 = Road("W","roadw5", 50, [0.1, 0.0, 0.2, 0.7])
roadw6 = Road("W","roadw6", 50, [0.1, 0.0, 0.2, 0.7])

# First item in each of the subarray is the input and output road pair 
new_traffic_light_a = [[[[0, 0], 25], 
                      [[0, 3], 5], 
                      [[2, 2], 25], 
                      [[2, 1], 5]], 
                     [[[1, 1], 25],
                      [[1, 0], 5],
                      [[3, 3], 25],
                      [[3, 2], 5]]]

new_traffic_light_b = [[[[1, 1], 25],
                       [[1, 0], 5],
                       [[3, 3], 25],
                       [[3, 2], 5]],
                      [[[0, 0], 25], 
                       [[0, 3], 5], 
                       [[2, 2], 25], 
                       [[2, 1], 5]]]



traffic_in_A = [roadn1, roade1, roads2, roadw2]
traffic_out_A = [roadn2, roade2, roads1, roadw1]

traffic_in_B = [roadn2, roade4, roads3, roadw5]
traffic_out_B = [roadn3, roade5, roads2, roadw4]

traffic_in_C = [roadn4, roade2, roads5, roadw3]
traffic_out_C = [roadn5, roade3, roads4, roadw2]

traffic_in_D = [roadn5, roade5, roads6, roadw6]
traffic_out_D = [roadn6, roade6, roads5, roadw5]

intersection_a = Intersection("7AM", "inter_a", traffic_in_A, traffic_out_A, new_traffic_light_a)
intersection_b = Intersection("7AM", "inter_b", traffic_in_B, traffic_out_B, new_traffic_light_a)
intersection_c = Intersection("7AM", "inter_c", traffic_in_C, traffic_out_C, new_traffic_light_b)
intersection_d = Intersection("7AM", "inter_d", traffic_in_D, traffic_out_D, new_traffic_light_b)

intersection_list = [intersection_a, intersection_b, intersection_c, intersection_d]

def process_intersections(intersection_list, process_cycle=100, light_durations=None):
    for intersections in intersection_list:
        for road in intersections.get_traffic_input():
            road.reset_road()
        for road in intersections.get_traffic_output():
            road.reset_road()
    time_processed = 0
    while time_processed < process_cycle:
        for intersections, duration in zip(intersection_list, light_durations):
            current_light_state = intersections.get_current_light_state()
            
            if intersections.queue_a_is_zero() and intersections.get_traffic_light_index() != 4:
                intersections.set_queue_a_time(duration)  
                intersections.set_current_light_a(intersections.get_traffic_light()[current_light_state][intersections.get_traffic_light_index()][0])
                intersections.increment_traffic_light_index()
            
            if intersections.queue_b_is_zero() and intersections.get_traffic_light_index() != 4:
                intersections.set_queue_b_time(duration)
                intersections.set_current_light_b(intersections.get_traffic_light()[current_light_state][intersections.get_traffic_light_index()][0])
                intersections.increment_traffic_light_index()
            
            instruction_a = intersections.get_current_light_a()
            instruction_b = intersections.get_current_light_b()

            if instruction_a[0] == instruction_b[0]:
                decode_and_process_instruction(instruction_a, intersections)
            else:
                decode_and_process_instruction(instruction_a, intersections, filter_direction=True)
                decode_and_process_instruction(instruction_b, intersections, filter_direction=True)
                
            intersections.decrement_queue_time()
            
            if (intersections.get_queue_time_a() <= 0) and (intersections.get_queue_time_b() <= 0) and (intersections.get_traffic_light_index() == 4):
                intersections.swap_current_light_state()
        
        time_processed += 1

# decodes the direction for traffic light a and b and processes the following instruction
def decode_and_process_instruction(instruction, intersection, filter_direction = False):
    #same entry point, can go any direction
    possible_choices = [1, 1, 1, 1]
    possible_choices[instruction[0] - 2] = 0     # can not go opposite direction (u turn), simplified for now
    if filter_direction:
            possible_choices[instruction[0] - 1] = 0       # on filter remove left turn 
    input_road = intersection.traffic_input[instruction[0]]
    input_road_choices = convert_to_cdf(input_road.get_edge_data())
    driver_choice = random.random()
    output_road_index = -1
    for i in range(len(input_road_choices)):
        if driver_choice < input_road_choices[i]:
            output_road_index = i
            break
    if possible_choices[output_road_index] == 1:                        # it is a possible move
        output_road = intersection.traffic_output[output_road_index]
        if output_road.add_car_to_road(1):
            if not input_road.remove_car_from_road(1):
                output_road.remove_car_from_road(1)  
        
    #Encoding: N = 0, E = 1, S = 2, W = 3

def convert_to_cdf(weight_list):
    new_list = [0, 0, 0, 0]
    sum = 0
    for i in range(len(weight_list)):
        sum += weight_list[i]
        new_list[i] = sum
    return new_list

def objective_function(durations):
    penalty_score = 0

    for i in range(1, len(durations), 2):  
        if durations[i] >= durations[i - 1]:  
            temp = durations[i - 1]
            durations[i - 1] = durations[i]
            durations[i] = temp
            penalty_score += 1  
        else:
            penalty_score -= 0.05

    if penalty_score <= 0:  
        return penalty_score

    index = 0
    for intersection in intersection_list:
        traffic_light = intersection.get_traffic_light()
        for state in range(2):  # 2 states (North/South and East/West)
            for seq in range(4):  # 4 sequences per state
                traffic_light[state][seq][1] = int(durations[index])  
                index += 1

    simulation_steps = 90
    process_intersections(intersection_list, simulation_steps, durations)

    total_congestion = 0
    total_cars_moved = 0
    total_roads = 0

    for intersection in intersection_list:
        for road in intersection.get_traffic_input() + intersection.get_traffic_output():
            road.calculate_congestion()
            total_congestion += road.get_congestion()
            total_cars_moved += road.get_current_capacity()
            total_roads += 1

    avg_congestion = total_congestion / total_roads

    return -avg_congestion

def load_traffic_data(filename):
    roads = {}
    intersections = {}
    with open(filename, "r") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  
        for row in reader:
            object_type = row[0]
            road_id = row[1]
            if object_type == "Road":
                direction = row[2]
                max_capacity = int(row[3])
                edge_data = [float(x) for x in row[4:]]
                roads[road_id] = Road(direction, road_id, max_capacity, edge_data)
            elif object_type == "Intersection":
                time_of_day = row[2]
                input_road_ids = row[3:7]
                output_road_ids = row[7:11]
                traffic_light = ast.literal_eval(row[11])
                input_roads = [roads[id] for id in input_road_ids]
                output_roads = [roads[id] for id in output_road_ids]
                intersections[road_id] = Intersection(time_of_day, road_id, input_roads, output_roads, traffic_light)
    return intersections.values()

#load csv file
intersection_list = list(load_traffic_data("data.csv"))

sample_durations = [25 if i % 2 == 0 else 5 for i in range(32)]
cycle_time = 90
process_intersections(intersection_list, process_cycle = cycle_time, light_durations=sample_durations)

print(f"Simulation for {cycle_time} seconds/steps, without optimization:")
for intersections in intersection_list:
    print(f"Intersection ID: {intersections.get_intersection_id()}")
    print("Input Traffics:")
    intersection_congestion = 0.0
    for road in intersections.get_traffic_input():
        print(f"Road ID: {road.get_road_id()}")
        print(f"Road Direction: {road.get_road_direction()}")
        print(f"Current Capacity: {road.get_current_capacity()}")
        road.calculate_congestion()
        intersection_congestion += road.get_congestion()
    print(f"Congestion for intersection: {intersection_congestion / 4:.2f}")
    print("Output Traffics:")
    for road in intersections.get_traffic_output():
        print(f"Road ID: {road.get_road_id()}")
        print(f"Road Direction: {road.get_road_direction()}")
        print(f"Current Capacity: {road.get_current_capacity()}")


space = [Integer(5, 45) for _ in range(32)] 

result = gp_minimize(objective_function, space, n_calls=75, random_state=42)

optimal_durations = result.x
#best_score = result.fun

process_intersections(intersection_list, process_cycle = cycle_time, light_durations=optimal_durations) #rerun with optimized durations

for intersections in intersection_list:
    print(f"Intersection ID: {intersections.get_intersection_id()}")
    print("Input Traffics:")
    intersection_congestion = 0.0
    for road in intersections.get_traffic_input():
        print(f"Road ID: {road.get_road_id()}")
        print(f"Road Direction: {road.get_road_direction()}")
        print(f"Current Capacity: {road.get_current_capacity()}")
        road.calculate_congestion()
        intersection_congestion += road.get_congestion()
    print(f"Congestion for intersection: {intersection_congestion / 4:.2f}")
    print("Output Traffics:")
    for road in intersections.get_traffic_output():
        print(f"Road ID: {road.get_road_id()}")
        print(f"Road Direction: {road.get_road_direction()}")
        print(f"Current Capacity: {road.get_current_capacity()}")

print("Optimal Traffic Light Durations:", optimal_durations)
#print("Best Performance Score:", best_score)

print("Optimization complete, saving the results to output.csv")