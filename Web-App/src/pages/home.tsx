import Navbar from '../components/navBar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from "lucide-react";

interface Hero1Props {
  badge?: string;
  heading?: string;
  description1?: string;
  description2?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image?: {
    src: string;
    alt: string;
  };
}

const HomePage = (props?: Hero1Props) => {
  const {
    heading = "Welcome to PoultryPal",
    description1 = "Manage your poultry farm’s daily records efficiently and effortlessly. Our application harnesses the power of AI and machine learning to provide predictive insights, enabling you to optimize operations like never before.",
    description2 = "From tracking egg production to analyzing feed efficiency, our intelligent models help you make informed decisions that lead to better productivity and profitability.",
    buttons = {
      primary: {
        text: "Get Started",
        url: "signup",
      },
      secondary: {
        text: "Dashboard",
        url: "login",
      },
    },
    image = {
      src: "farm.jpg",
      alt: "Hero section demo image showing interface components",
    },
  } = props || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="px-16 py-8 mb-16 flex-1">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="my-6 text-3xl font-bold text-pretty lg:text-4xl">
                {heading}
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-md">
                {description1}
              </p>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-md">
                {description2}
              </p>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                {buttons.primary && (
                  <Button asChild className="w-full sm:w-auto">
                    <a href={buttons.primary.url}>{buttons.primary.text}</a>
                  </Button>
                )}
                {buttons.secondary && (
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a href={buttons.secondary.url}>
                      {buttons.secondary.text}
                      <ArrowRight className="size-4 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-96 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;