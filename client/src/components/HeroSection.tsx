import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const decorElements = [
    { bottom: "-16", left: "-16", width: "64", height: "64" },
    { top: "10", right: "20", width: "32", height: "32" },
    { bottom: "20", right: "10", width: "48", height: "48" },
  ];

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-light text-white py-20 overflow-hidden">
      {/* Water-like decorative elements */}
      {decorElements.map((elem, index) => (
        <motion.div
          key={index}
          className={`hidden lg:block absolute bg-white bg-opacity-10 rounded-full`}
          style={{
            bottom: elem.bottom?.endsWith("-") ? elem.bottom : undefined,
            top: elem.top?.endsWith("-") ? elem.top : undefined,
            left: elem.left?.endsWith("-") ? elem.left : undefined,
            right: elem.right?.endsWith("-") ? elem.right : undefined,
            width: `${elem.width}px`,
            height: `${elem.height}px`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 * index, duration: 0.8 }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            variants={itemVariants}
          >
            Professional Aquarium Analysis Tools
          </motion.h1>
          <motion.p
            className="mt-4 text-xl max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Identify algae issues and diagnose fish health problems with our
            advanced AI-powered tools
          </motion.p>
          <motion.div className="mt-10" variants={itemVariants}>
            <Button
              onClick={scrollToTools}
              size="lg"
              variant="secondary"
              className="text-primary font-medium bg-white hover:bg-gray-100"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
