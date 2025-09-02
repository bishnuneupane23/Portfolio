export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-about-title">
              About Me
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6" data-testid="text-about-paragraph-1">
              I'm deeply passionate about building reliable, high-quality software. With hands-on experience in manual testing and a growing skill set in automation, I thrive on uncovering bugs, crafting efficient test cases, and ensuring smooth user experiences.
            </p>

            <p className="text-lg leading-relaxed mb-6" data-testid="text-about-paragraph-2">
              My journey began at Broadway Infosys, where I trained rigorously in QA practices, contributed to real-world projects, and collaborated with cross-functional teams to deliver results. I'm skilled in bug tracking with tools like JIRA, and have led QA efforts during agile sprints—driving quality with strong communication and leadership.
            </p>

            <p className="text-lg leading-relaxed" data-testid="text-about-paragraph-3">
              Currently, I lead the QA function at ankaEK, where I continue to advocate for excellence in every release. Let's connect if you're passionate about quality, product improvement, or tech-driven teamwork!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
