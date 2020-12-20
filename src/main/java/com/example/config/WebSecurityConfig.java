package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
            http
                    .authorizeRequests()
                        .antMatchers("/h2-console/**").access("hasRole('ROLE_ADMIN')")
                        .anyRequest().authenticated()
                    .and()
                        .formLogin()
                        .permitAll()
                    .and()
                        .logout()
                        .permitAll();
            http.csrf().ignoringAntMatchers("/h2-console/**");
            http.headers().frameOptions().sameOrigin();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                    .withUser("admin")
                    .password("{noop}666ncProject666")
                    .roles("ADMIN", "USER")
                .and()
                    .withUser("user")
                    .password("{noop}666ncProject666")
                    .roles("USER");
    }
}