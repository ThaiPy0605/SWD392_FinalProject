package com.swd392.finalproject.config;

import com.swd392.finalproject.entity.*;
import com.swd392.finalproject.enums.OrderStatus;
import com.swd392.finalproject.enums.PaymentMethod;
import com.swd392.finalproject.enums.Role;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EntityManager entityManager;
    private final String ddlAuto;

    public DataInitializer(EntityManager entityManager,
                           @Value("${spring.jpa.hibernate.ddl-auto:}") String ddlAuto) {
        this.entityManager = entityManager;
        this.ddlAuto = ddlAuto;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!"create".equalsIgnoreCase(ddlAuto) && !"create-drop".equalsIgnoreCase(ddlAuto)) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        String[] categoryNames = {"Skincare", "Makeup", "Body Care", "Hair Care", "Fragrance"};
        List<Category> categories = new ArrayList<>();
        for (String categoryName : categoryNames) {
            Category category = new Category();
            category.setName(categoryName);
            entityManager.persist(category);
            categories.add(category);
        }

        String[] brandNames = {"Glow Lab", "Luna Beauty", "Pure Bloom", "Aura Skin", "Velvet Care"};
        List<Brand> brands = new ArrayList<>();
        for (String brandName : brandNames) {
            Brand brand = new Brand();
            brand.setName(brandName);
            entityManager.persist(brand);
            brands.add(brand);
        }

        String[] productNames = {
                "Hydrating Serum",
                "Velvet Matte Lipstick",
                "Nourishing Body Lotion",
                "Repair Shampoo",
                "Fresh Bloom Mist"
        };
        BigDecimal[] productPrices = {
                new BigDecimal("299000"),
                new BigDecimal("249000"),
                new BigDecimal("199000"),
                new BigDecimal("189000"),
                new BigDecimal("159000")
        };
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < productNames.length; i++) {
            Product product = new Product();
            product.setName(productNames[i]);
            product.setDescription("Sample product " + (i + 1) + " for local development");
            product.setPrice(productPrices[i]);
            product.setStockQty(100 + (i * 20));
            product.setImageUrl("https://example.com/images/product-" + (i + 1) + ".jpg");
            product.setCategory(categories.get(i));
            product.setBrand(brands.get(i));
            entityManager.persist(product);
            products.add(product);
        }

        String[] userNames = {"System Admin", "Demo Member", "Linh Tran", "Bao Nguyen", "Anh Pham"};
        String[] userEmails = {
                "admin@example.com",
                "member@example.com",
                "linh@example.com",
                "bao@example.com",
                "anh@example.com"
        };
        Role[] roles = {Role.ADMIN, Role.MEMBER, Role.MEMBER, Role.STAFF, Role.GUEST};
        List<User> users = new ArrayList<>();
        for (int i = 0; i < userNames.length; i++) {
            User user = new User();
            user.setFullName(userNames[i]);
            user.setEmail(userEmails[i]);
            user.setPasswordHash("password" + (i + 1));
            user.setRole(roles[i]);
            entityManager.persist(user);
            users.add(user);
        }

        String[] courseTitles = {
                "Basic Skin Care",
                "Advanced Makeup",
                "Body Care Routine",
                "Hair Care Essentials",
                "Fragrance Layering 101"
        };
        String[] courseLevels = {"Beginner", "Intermediate", "Beginner", "Intermediate", "Advanced"};
        List<Course> courses = new ArrayList<>();
        for (int i = 0; i < courseTitles.length; i++) {
            Course course = new Course();
            course.setTitle(courseTitles[i]);
            course.setLevel(courseLevels[i]);
            course.setContent("Sample course content " + (i + 1));
            course.setPrice(new BigDecimal(149000 + (i * 50000)));
            entityManager.persist(course);
            courses.add(course);
        }

        String[] discountCodes = {"WELCOME10", "SUMMER15", "MEMBER20", "FLASH5", "VIP25"};
        int[] discountPercents = {10, 15, 20, 5, 25};
        List<Discount> discounts = new ArrayList<>();
        for (int i = 0; i < discountCodes.length; i++) {
            Discount discount = new Discount();
            discount.setCode(discountCodes[i]);
            discount.setPercent(discountPercents[i]);
            discount.setExpiry(LocalDate.now().plusMonths(i + 1L));
            discount.setMinSpend(new BigDecimal(300000 + (i * 100000)));
            entityManager.persist(discount);
            discounts.add(discount);
        }

        List<Cart> carts = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            Cart cart = new Cart();
            cart.setUpdatedAt(now.minusDays(i));
            cart.setUser(users.get(i));
            entityManager.persist(cart);
            carts.add(cart);
        }

        for (int i = 0; i < carts.size(); i++) {
            CartItem cartItem = new CartItem();
            cartItem.setCart(carts.get(i));
            cartItem.setProduct(products.get(i));
            cartItem.setQuantity(i + 1);
            cartItem.setUnitPrice(products.get(i).getPrice());
            entityManager.persist(cartItem);
        }

        OrderStatus[] orderStatuses = {
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.SHIPPING,
                OrderStatus.COMPLETED,
                OrderStatus.CANCELLED
        };
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            Order order = new Order();
            order.setOrderDate(now.minusDays(i));
            order.setStatus(orderStatuses[i]);
            order.setShippingAddress((100 + i) + " Demo Street");
            order.setTotalAmount(products.get(i).getPrice().multiply(BigDecimal.valueOf(i + 1L)));
            order.setUser(users.get(i));
            order.setDiscount(discounts.get(i));
            entityManager.persist(order);
            orders.add(order);
        }

        for (int i = 0; i < orders.size(); i++) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(orders.get(i));
            orderItem.setProduct(products.get(i));
            orderItem.setQuantity(i + 1);
            orderItem.setUnitPrice(products.get(i).getPrice());
            entityManager.persist(orderItem);
        }

        PaymentMethod[] paymentMethods = {
                PaymentMethod.BANK_TRANSFER,
                PaymentMethod.CREDIT_CARD,
                PaymentMethod.E_WALLET,
                PaymentMethod.CASH,
                PaymentMethod.BANK_TRANSFER
        };
        String[] paymentStatuses = {"PENDING", "PAID", "PAID", "FAILED", "REFUNDED"};
        for (int i = 0; i < orders.size(); i++) {
            Payment payment = new Payment();
            payment.setOrder(orders.get(i));
            payment.setMethod(paymentMethods[i]);
            payment.setAmount(orders.get(i).getTotalAmount());
            payment.setStatus(paymentStatuses[i]);
            payment.setTransactionRef("TXN-SAMPLE-00" + (i + 1));
            entityManager.persist(payment);
        }

        for (int i = 0; i < courses.size(); i++) {
            Enrollment enrollment = new Enrollment();
            enrollment.setUser(users.get(i));
            enrollment.setCourse(courses.get(i));
            enrollment.setEnrolledAt(now.minusDays(i * 2L));
            enrollment.setProgress(i * 20);
            enrollment.setStatus(i == 4 ? "COMPLETED" : "ACTIVE");
            entityManager.persist(enrollment);
        }

        String[] reviewComments = {
                "Great sample product",
                "Very useful for daily use",
                "Good quality and texture",
                "Works as expected",
                "Worth trying for beginners"
        };
        for (int i = 0; i < products.size(); i++) {
            Review review = new Review();
            review.setUser(users.get(i));
            review.setProduct(products.get(i));
            review.setRating(5 - (i % 2));
            review.setComment(reviewComments[i]);
            entityManager.persist(review);
        }

        String[] ticketStatuses = {"OPEN", "IN_PROGRESS", "RESOLVED", "OPEN", "CLOSED"};
        for (int i = 0; i < users.size(); i++) {
            SupportTicket supportTicket = new SupportTicket();
            supportTicket.setUser(users.get(i));
            supportTicket.setSubject("Support request #" + (i + 1));
            supportTicket.setMessage("This is seeded support ticket number " + (i + 1) + " for testing.");
            supportTicket.setStatus(ticketStatuses[i]);
            supportTicket.setReply(i < 2 ? null : "Sample support reply " + (i + 1));
            entityManager.persist(supportTicket);
        }
    }
}
