package com.scisbo.webphone.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.UnsatisfiedDependencyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

@SpringJUnitConfig
public class ImageResizerTest {

    private static final String TARGET_SHORT_SIDE = "image.optimizer.target-short-side";

    @SpringJUnitConfig
    public static class TargetShortSideAbsent {

        @Autowired
        private GenericApplicationContext ctx;

        @Test
        public void test() {
            ctx.registerBean(ImageResizer.class);
            assertThrows(UnsatisfiedDependencyException.class, () -> ctx.getBean(ImageResizer.class));
        }
    }

    @SpringJUnitConfig
    @TestPropertySource(properties = { TARGET_SHORT_SIDE + "=0"})
    public static class TargetShortSideZero {
        @Autowired
        private GenericApplicationContext ctx;

        @Test
        public void test() {
            ctx.registerBean(ImageResizer.class);
            assertThrows(BeanCreationException.class, () -> ctx.getBean(ImageResizer.class));
        }
    }

    @SpringJUnitConfig
    @TestPropertySource(properties = { TARGET_SHORT_SIDE + "=-100"})
    public static class TargetShortSideNegative {
        @Autowired
        private GenericApplicationContext ctx;

        @Test
        public void test() {
            ctx.registerBean(ImageResizer.class);
            assertThrows(BeanCreationException.class, () -> ctx.getBean(ImageResizer.class));
        }
    }

    @SpringJUnitConfig(ImageResizer.class)
    @TestPropertySource(properties = { TARGET_SHORT_SIDE + "=1200"})
    public static class TargetShortSideLongerThanOrigin {

        @Autowired
        private ImageResizer resizer;

        @Value("${image.optimizer.target-short-side}")
        private int targetShortSide;

        @Test
        public void testOptimize() throws Exception {
            Path src = Path.of(getClass().getResource("image.jpeg").toURI());
            Path dest = Path.of(src.toAbsolutePath().toString() + ".min." + targetShortSide + ".jpeg");
            optimize(this.resizer, src, dest);

            BufferedImage image = ImageIO.read(src.toFile());
            BufferedImage resizedImage = ImageIO.read(dest.toFile());

            assertEquals(image.getWidth(), resizedImage.getWidth());
            assertEquals(image.getHeight(), resizedImage.getHeight());
        }
    }

    @SpringJUnitConfig(ImageResizer.class)
    @TestPropertySource(properties = { TARGET_SHORT_SIDE + "=350"})
    public static class TargetShortSideShorterThanOrigin {

        @Autowired
        private ImageResizer resizer;

        @Value("${image.optimizer.target-short-side}")
        private int targetShortSide;

        @Test
        public void testOptimize() throws Exception {
            Path src = Path.of(getClass().getResource("image.jpeg").toURI());
            Path dest = Path.of(src.toAbsolutePath().toString() + ".min." + targetShortSide + ".jpeg");
            optimize(this.resizer, src, dest);

            BufferedImage image = ImageIO.read(src.toFile());
            BufferedImage resizedImage = ImageIO.read(dest.toFile());

            int width = image.getWidth(), height = image.getHeight();
            double scale = targetShortSide / (double) Math.min(width, height);
            assertEquals((int) (width * scale), resizedImage.getWidth());
            assertEquals((int) (height * scale), resizedImage.getHeight());
        }
    }

    private static void optimize(ImageResizer resizer, Path input, Path output) throws IOException {
        byte[] image = Files.readAllBytes(input);
        byte[] resizedImage = resizer.optimize(image, "jpeg");
        Files.write(output, resizedImage);
    }

}
