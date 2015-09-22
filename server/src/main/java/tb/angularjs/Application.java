package tb.angularjs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.SpringBootRepositoryRestMvcConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import tb.angularjs.photos.model.Photo;
import tb.angularjs.photos.repository.PhotoRepository;

@SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan
@EnableJpaRepositories
@Import(RepositoryRestMvcConfiguration.class)
public class Application extends SpringBootRepositoryRestMvcConfiguration {

    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Photo.class);
    }


    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(Application.class, args);

        //ConfigurableApplicationContext context = SpringApplication.run(Application.class);
        PhotoRepository repository = ctx.getBean(PhotoRepository.class);

        // save a couple of customers
        repository.save(new Photo(1,"Jack", "Bauer", "1"));
        repository.save(new Photo(2,"Chloe", "O'Brian", "1"));
        repository.save(new Photo(3,"Kim", "Bauer", "1"));
        repository.save(new Photo(4,"David", "Palmer", "1"));
        repository.save(new Photo(5,"Michelle", "Dessler", "1"));

        // fetch all customers
        Iterable<Photo> customers = repository.findAll();
        System.out.println("Customers found with findAll():");
        System.out.println("-------------------------------");
        for (Photo customer : customers) {
            System.out.println(customer);
        }
        System.out.println();


    }

}
