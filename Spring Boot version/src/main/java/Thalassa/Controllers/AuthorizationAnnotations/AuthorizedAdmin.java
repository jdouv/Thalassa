package Thalassa.Controllers.AuthorizationAnnotations;

import org.springframework.security.access.prepost.PreAuthorize;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Custom controller meta annotation to authorize administrator to access relevant resources
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasRole('admin')")
public @interface AuthorizedAdmin { }