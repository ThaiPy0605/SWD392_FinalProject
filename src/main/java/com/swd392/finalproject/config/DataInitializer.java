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

        Category category = new Category();
        category.setName("Skincare");
        entityManager.persist(category);

        Brand brand = new Brand();
        brand.setName("Glow Lab");
        entityManager.persist(brand);

        Product product = new Product();
        product.setName("Hydrating Serum");
        product.setDescription("Sample serum for local development");
        product.setPrice(new BigDecimal("299000"));
        product.setStockQty(100);
        product.setImageUrl("https://example.com/images/hydrating-serum.jpg");
        product.setCategory(category);
        product.setBrand(brand);
        entityManager.persist(product);

        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail("admin@example.com");
        admin.setPasswordHash("admin123");
        admin.setRole(Role.ADMIN);
        entityManager.persist(admin);

        User member = new User();
        member.setFullName("Demo Member");
        member.setEmail("member@example.com");
        member.setPasswordHash("member123");
        member.setRole(Role.MEMBER);
        entityManager.persist(member);

        Course course = new Course();
        course.setTitle("Basic Skin Care");
        course.setLevel("Beginner");
        course.setContent("Sample training content");
        course.setPrice(new BigDecimal("199000"));
        entityManager.persist(course);

        Discount discount = new Discount();
        discount.setCode("WELCOME10");
        discount.setPercent(10);
        discount.setExpiry(LocalDate.now().plusMonths(1));
        discount.setMinSpend(new BigDecimal("500000"));
        entityManager.persist(discount);

        Cart cart = new Cart();
        cart.setUpdatedAt(LocalDateTime.now());
        cart.setUser(member);
        entityManager.persist(cart);

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(1);
        cartItem.setUnitPrice(product.getPrice());
        entityManager.persist(cartItem);

        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress("123 Demo Street");
        order.setTotalAmount(product.getPrice());
        order.setUser(member);
        order.setDiscount(discount);
        entityManager.persist(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setUnitPrice(product.getPrice());
        entityManager.persist(orderItem);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(PaymentMethod.BANK_TRANSFER);
        payment.setAmount(order.getTotalAmount());
        payment.setStatus("PENDING");
        payment.setTransactionRef("TXN-SAMPLE-001");
        entityManager.persist(payment);

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(member);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setProgress(0);
        enrollment.setStatus("ACTIVE");
        entityManager.persist(enrollment);

        Review review = new Review();
        review.setUser(member);
        review.setProduct(product);
        review.setRating(5);
        review.setComment("Great sample product");
        entityManager.persist(review);

        SupportTicket supportTicket = new SupportTicket();
        supportTicket.setUser(member);
        supportTicket.setSubject("Need help with sample order");
        supportTicket.setMessage("This is a seeded support ticket for testing.");
        supportTicket.setStatus("OPEN");
        supportTicket.setReply(null);
        entityManager.persist(supportTicket);
    }
}
