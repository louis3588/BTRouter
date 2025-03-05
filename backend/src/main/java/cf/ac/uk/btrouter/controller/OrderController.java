////package cf.ac.uk.btrouter.controller;
////
////import cf.ac.uk.btrouter.model.RouterRequest;
////import cf.ac.uk.btrouter.repository.RouterRequestRepository;
////import org.springframework.security.core.annotation.AuthenticationPrincipal;
////import org.springframework.security.core.userdetails.User;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.*;
////import java.util.stream.Collectors;
////
////@RestController
////@RequestMapping("/api/orders")
////@CrossOrigin(origins = "http://localhost:3000")
////public class OrderController {
////
////    private final RouterRequestRepository routerRequestRepository;
////
////    public OrderController(RouterRequestRepository routerRequestRepository) {
////        this.routerRequestRepository = routerRequestRepository;
////    }
////
////    @GetMapping
////    public Map<String, Object> getOrders(@AuthenticationPrincipal User user) {
////        List<RouterRequest> orders = routerRequestRepository.findByPrimaryEmail(user.getUsername());
////
////        if (orders.isEmpty()) {
////            return Map.of("message", "No orders found for this user");
////        }
////
////        // Count most frequently ordered routers
////        Map<String, Long> routerCount = orders.stream()
////                .collect(Collectors.groupingBy(RouterRequest::getRouterType, Collectors.counting()));
////
////        String mostOrderedRouter = routerCount.entrySet().stream()
////                .max(Map.Entry.comparingByValue())
////                .map(Map.Entry::getKey)
////                .orElse("No routers ordered");
////
////        Map<String, Object> response = new HashMap<>();
////        response.put("orders", orders);
////        response.put("mostOrderedRouter", mostOrderedRouter);
////
////        return response;
////    }
////
////}
//
//
////test1
////package cf.ac.uk.btrouter.controller;
////
////import cf.ac.uk.btrouter.model.RouterRequest;
////import cf.ac.uk.btrouter.repository.RouterRequestRepository;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.*;
////
////@RestController
////@RequestMapping("/api/orders")
////@CrossOrigin(origins = "*")
////public class OrderController {
////
////    private final RouterRequestRepository routerRequestRepository;
////
////    public OrderController(RouterRequestRepository routerRequestRepository) {
////        this.routerRequestRepository = routerRequestRepository;
////    }
////
////    @GetMapping("/history")
////    public Map<String, Object> getOrderHistory() {
////        Map<String, Object> response = new HashMap<>();
////
////        // Fetch real data from the database
////        List<RouterRequest> orders = routerRequestRepository.findAll();
////
////        if (!orders.isEmpty()) {
////            // If database has records, return real data
////            RouterRequest mostFrequent = orders.get(0); // Assume first is the most frequent for now
////
////            Map<String, Object> mostFrequentOrder = new HashMap<>();
////            mostFrequentOrder.put("routerType", mostFrequent.getRouterType());
////            mostFrequentOrder.put("outsideConnection", mostFrequent.getOutsideConnection());
////            mostFrequentOrder.put("insideConnection", mostFrequent.getInsideConnection());
////            mostFrequentOrder.put("numberOfPorts", mostFrequent.getNumberOfPorts());
////
////            List<Map<String, Object>> previousOrders = new ArrayList<>();
////            for (RouterRequest order : orders) {
////                Map<String, Object> orderData = new HashMap<>();
////                orderData.put("orderId", "#" + order.getId());
////                orderData.put("routerType", order.getRouterType());
////                orderData.put("orderDate", order.getOrderDate().toString());
////                orderData.put("orderStatus", order.getStatus());
////
////                previousOrders.add(orderData);
////            }
////
////            response.put("mostFrequentOrder", mostFrequentOrder);
////            response.put("previousOrders", previousOrders);
////        } else {
////            // If no data in the database, return mock data
////            response.put("mostFrequentOrder", getMockMostFrequentOrder());
////            response.put("previousOrders", getMockPreviousOrders());
////        }
////
////        return response;
////    }
////
////    private Map<String, Object> getMockMostFrequentOrder() {
////        Map<String, Object> mostFrequentOrder = new HashMap<>();
////        mostFrequentOrder.put("routerType", "GW1042M");
////        mostFrequentOrder.put("outsideConnection", "Mobile Radio - Roaming Sim");
////        mostFrequentOrder.put("insideConnection", "Customer Ethernet");
////        mostFrequentOrder.put("numberOfPorts", 2);
////        return mostFrequentOrder;
////    }
////
////    private List<Map<String, Object>> getMockPreviousOrders() {
////        List<Map<String, Object>> previousOrders = new ArrayList<>();
////
////        Map<String, Object> order1 = new HashMap<>();
////        order1.put("orderId", "#00123");
////        order1.put("routerType", "GW1042M");
////        order1.put("orderDate", "01 Feb 2025");
////        order1.put("orderStatus", "Delivered");
////
////        Map<String, Object> order2 = new HashMap<>();
////        order2.put("orderId", "#00122");
////        order2.put("routerType", "Westermo Merlin 4708");
////        order2.put("orderDate", "15 Jan 2025");
////        order2.put("orderStatus", "Cancelled");
////
////        previousOrders.add(order1);
////        previousOrders.add(order2);
////
////        return previousOrders;
////    }
//
//package cf.ac.uk.btrouter.controller;
//
//import cf.ac.uk.btrouter.model.RouterRequest;
//import cf.ac.uk.btrouter.repository.RouterRequestRepository;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/orders")
//@CrossOrigin(origins = "*")
//public class OrderController {
//
//    private final RouterRequestRepository routerRequestRepository;
//
//    public OrderController(RouterRequestRepository routerRequestRepository) {
//        this.routerRequestRepository = routerRequestRepository;
//    }
//
//    @GetMapping
//    public Map<String, Object> getOrderHistory() {
//        Map<String, Object> response = new HashMap<>();
//
//        List<RouterRequest> orders = routerRequestRepository.findAll();
//
//        if (!orders.isEmpty()) {
//            // Use first order as "most frequently ordered" (for now)
//            RouterRequest mostFrequent = orders.get(0);
//
//            response.put("mostOrderedRouter", mostFrequent.getRouterType());
//            response.put("orders", orders);
//        } else {
//            // Return mock data if database is empty
//            response.put("mostOrderedRouter", "GW1042M");
//
//            List<Map<String, Object>> mockOrders = new ArrayList<>();
//
//            Map<String, Object> order1 = new HashMap<>();
//            order1.put("id", "00123");
//            order1.put("routerType", "GW1042M");
//            order1.put("orderDate", "2025-02-01");
//            order1.put("status", "Delivered");
//            mockOrders.add(order1);
//
//            Map<String, Object> order2 = new HashMap<>();
//            order2.put("id", "00122");
//            order2.put("routerType", "Westermo Merlin 4708");
//            order2.put("orderDate", "2025-01-15");
//            order2.put("status", "Cancelled");
//            mockOrders.add(order2);
//
//            response.put("orders", mockOrders);
//        }
//
//        return response;
//    }
//}




// =====================================

//package cf.ac.uk.btrouter.controller;
//
//import cf.ac.uk.btrouter.model.RouterRequest;
//import cf.ac.uk.btrouter.repository.RouterRequestRepository;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/orders")
//@CrossOrigin(origins = "http://localhost:3000")
//public class OrderController {
//
//    private final RouterRequestRepository routerRequestRepository;
//
//    public OrderController(RouterRequestRepository routerRequestRepository) {
//        this.routerRequestRepository = routerRequestRepository;
//    }
//
//    @GetMapping
//    public Map<String, Object> getOrders(@AuthenticationPrincipal User user) {
//        List<RouterRequest> orders = routerRequestRepository.findByPrimaryEmail(user.getUsername());
//
//        if (orders.isEmpty()) {
//            return Map.of("message", "No orders found for this user");
//        }
//
//        // Count most frequently ordered routers
//        Map<String, Long> routerCount = orders.stream()
//                .collect(Collectors.groupingBy(RouterRequest::getRouterType, Collectors.counting()));
//
//        String mostOrderedRouter = routerCount.entrySet().stream()
//                .max(Map.Entry.comparingByValue())
//                .map(Map.Entry::getKey)
//                .orElse("No routers ordered");
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("orders", orders);
//        response.put("mostOrderedRouter", mostOrderedRouter);
//
//        return response;
//    }
//
//}


//test1
//package cf.ac.uk.btrouter.controller;
//
//import cf.ac.uk.btrouter.model.RouterRequest;
//import cf.ac.uk.btrouter.repository.RouterRequestRepository;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/orders")
//@CrossOrigin(origins = "*")
//public class OrderController {
//
//    private final RouterRequestRepository routerRequestRepository;
//
//    public OrderController(RouterRequestRepository routerRequestRepository) {
//        this.routerRequestRepository = routerRequestRepository;
//    }
//
//    @GetMapping("/history")
//    public Map<String, Object> getOrderHistory() {
//        Map<String, Object> response = new HashMap<>();
//
//        // Fetch real data from the database
//        List<RouterRequest> orders = routerRequestRepository.findAll();
//
//        if (!orders.isEmpty()) {
//            // If database has records, return real data
//            RouterRequest mostFrequent = orders.get(0); // Assume first is the most frequent for now
//
//            Map<String, Object> mostFrequentOrder = new HashMap<>();
//            mostFrequentOrder.put("routerType", mostFrequent.getRouterType());
//            mostFrequentOrder.put("outsideConnection", mostFrequent.getOutsideConnection());
//            mostFrequentOrder.put("insideConnection", mostFrequent.getInsideConnection());
//            mostFrequentOrder.put("numberOfPorts", mostFrequent.getNumberOfPorts());
//
//            List<Map<String, Object>> previousOrders = new ArrayList<>();
//            for (RouterRequest order : orders) {
//                Map<String, Object> orderData = new HashMap<>();
//                orderData.put("orderId", "#" + order.getId());
//                orderData.put("routerType", order.getRouterType());
//                orderData.put("orderDate", order.getOrderDate().toString());
//                orderData.put("orderStatus", order.getStatus());
//
//                previousOrders.add(orderData);
//            }
//
//            response.put("mostFrequentOrder", mostFrequentOrder);
//            response.put("previousOrders", previousOrders);
//        } else {
//            // If no data in the database, return mock data
//            response.put("mostFrequentOrder", getMockMostFrequentOrder());
//            response.put("previousOrders", getMockPreviousOrders());
//        }
//
//        return response;
//    }
//
//    private Map<String, Object> getMockMostFrequentOrder() {
//        Map<String, Object> mostFrequentOrder = new HashMap<>();
//        mostFrequentOrder.put("routerType", "GW1042M");
//        mostFrequentOrder.put("outsideConnection", "Mobile Radio - Roaming Sim");
//        mostFrequentOrder.put("insideConnection", "Customer Ethernet");
//        mostFrequentOrder.put("numberOfPorts", 2);
//        return mostFrequentOrder;
//    }
//
//    private List<Map<String, Object>> getMockPreviousOrders() {
//        List<Map<String, Object>> previousOrders = new ArrayList<>();
//
//        Map<String, Object> order1 = new HashMap<>();
//        order1.put("orderId", "#00123");
//        order1.put("routerType", "GW1042M");
//        order1.put("orderDate", "01 Feb 2025");
//        order1.put("orderStatus", "Delivered");
//
//        Map<String, Object> order2 = new HashMap<>();
//        order2.put("orderId", "#00122");
//        order2.put("routerType", "Westermo Merlin 4708");
//        order2.put("orderDate", "15 Jan 2025");
//        order2.put("orderStatus", "Cancelled");
//
//        previousOrders.add(order1);
//        previousOrders.add(order2);
//
//        return previousOrders;
//    }

package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.RouterRequest;
import cf.ac.uk.btrouter.repository.RouterRequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final RouterRequestRepository routerRequestRepository;

    public OrderController(RouterRequestRepository routerRequestRepository) {
        this.routerRequestRepository = routerRequestRepository;
    }

    @GetMapping
    public Map<String, Object> getOrderHistory() {
        Map<String, Object> response = new HashMap<>();

        List<RouterRequest> orders = routerRequestRepository.findAll();

        if (!orders.isEmpty()) {
            // Use first order as "most frequently ordered" (for now)
            RouterRequest mostFrequent = orders.get(0);

            response.put("mostOrderedRouter", mostFrequent.getRouterType());
            response.put("orders", orders);
        } else {
            // Return mock data if database is empty
            response.put("mostOrderedRouter", "GW1042M");

            List<Map<String, Object>> mockOrders = new ArrayList<>();

            Map<String, Object> order1 = new HashMap<>();
            order1.put("id", "00123");
            order1.put("routerType", "GW1042M");
            order1.put("orderDate", "2025-02-01");
            order1.put("status", "Delivered");
            mockOrders.add(order1);

            Map<String, Object> order2 = new HashMap<>();
            order2.put("id", "00122");
            order2.put("routerType", "Westermo Merlin 4708");
            order2.put("orderDate", "2025-01-15");
            order2.put("status", "Cancelled");
            mockOrders.add(order2);

            response.put("orders", mockOrders);
        }

        return response;
    }
}

