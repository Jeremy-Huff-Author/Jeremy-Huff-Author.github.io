The last time I wrote a novel was in 2018.

It was for NANOWRIMO, and it was the first draft of the book I am currently working on. At that time I utilized Scrivener for planning and writing my story. There were two main features that I loved about Scrivener, and really only one reason why I decided not to use it this time around.

1. The customizability, and
1. The distinction between content and presentation
The ability for Scrivener to allow me to indulge what I learned was an extreme degree of plotting really appealed to me. I loved the ability to plan out character and location, or to break down scenes into atomic events or story beats. And then, I was able to compose all these things together in an outline, that would later become my story.

The second draw for me, the distinction between content and presentation, is summed up in the fact that when using scrivener, the page on which you author your document does not govern the appearance of a rendered manuscript. In word, if you want to reformat your text, you have to copy the document and change the formatting. In scrivener, the authored text is independent of the formatted output, which allows you to create multiple outputs for one source text. 

Really, for me, the only draw back for Scrivener was its lack of cloud support. I really did not want to have to rely on third party file syncing services to be able to edit my book from multiple computers. I use 5 different machines on a regular basis, and discrete installations of Scrivener on each machine did not seem like a tenable solution.

So, when I decided to begin writing again I chose Notion as my replacement for Scrivener. I am very happy I made this decision. Notion is cloud first, so it certainly solves that issue for me. Additionally, it very easily exceeds Scrivener on customization. It does not, in any way address the content/presentation distinction. For this I utilized Notion’s excellent API to build my own tool that allows me to extract and format the content of my novel any way I see fit. 

I will now talk through how it all works.

## Overview

My novel is represented as a private workspace in my free notion account. The landing page looks like this:



![](/blog/posts/notion-for-authors/image-1.png)



I have a thematic banner which sets the mood for my project. A set of quick links that allows me to jump quickly to the components of my process. I highlight the current scene that I am working on, so that I can jump to it quickly. I also display the progress of whatever draft I am currently working on.

Finally, I list out all of the perspective character that appeal in my novel, with portraits. Now I will dive into each of the planning components I use.

### Character

![](/blog/posts/notion-for-authors/image-2.png)

 

The main view for my character database is a gallery view, which displays a portrait for each character, and a check box which allows me to indicate if a character will be a perspective character in the book. The fields which I use to define my character’s are fairly simple:

- Name
- Events - a back link to all events which the character appears in
- Perspective Character - the toggle that indicates if the character is a perspective character
Aside from these, each character has a page dedicated to it, which contains a detailed physical and psychological description, as well as any concept art associated with the character. 

### Locations

![](/blog/posts/notion-for-authors/image-3.png)



Like character, I use a gallery for the default view of Locations. Here, I expose a “featured” check box that will cause the locations image and description to appear in the Gallery section of my website.

Location are very simple objects, consisting only of a name and back links the scenes in which the location appears.

### Events

![](/blog/posts/notion-for-authors/image-4.png)

Events are where things start to get a little more complicated.

I utilize a board layout for the default Events view. Here I group each event by scene. This allows my to arrange the events of my story into scenes, and quickly establish an outline for the narrative.

The properties of an event are:

- Name
- Characters - a list of all the characters that are involved in the event
- Locations - a list of all the locations that are involved in the event
- Date - I utilize this field to establish a chronology for the events in the story
- Perspective - This is a backlink from the Scene object. This means that this value will be auto populated with whatever perspective its parent scene has been set to.
- Scene - the parent scene in which the event occurs
### Scenes

![](/blog/posts/notion-for-authors/image-5.png)

The scene is the heart of my organizational components. My default view for scenes is simply a tabular view. The page content of a scene is the text of my novel, meaning that I am writing my narrative into Notion directly, one scene at a time.

I want to highlight one of the reasons that I this. Here is what it looks like when I a composing a scene:

 

![](/blog/posts/notion-for-authors/image-6.png)

I have a thematic visual for the scene as a cover image. The title, status and word count of the scene. To the side I have a slide out section that contains all of the other scene properties. This allows my, when writing a scene, to quickly glance over and see all of the scene’s events, characters, locations, and even a summary for the scene.

The page content is dedicated to the text of the scene. I find that this environment is very conducive for keeping me focused on what I am writing, and all of the components that make it up.

The properties of a scene are:

- Summary
- Status
- Word Count
- Events
- Characters
- Locations
- Chapter - the chapter to which the scene belongs
- Notes - A section that allows me to leave editorial feedback for myself
- Perspective - the perspective from which this scene is told
- Satisfaction - The degree to which I feel content with the state of the scene
- Story Beat - The role this scene plays in the overal structure of the narrative.
Chapter

![](/blog/posts/notion-for-authors/image-7.png)



The chapter’s database consists of:

- Name
- Title
- Scenes
- Summary (which I am not using at this level)
- Status
- Word Count - this value is automatically calculated from the total word counts of the scenes within the chapter
The chapter component is used by my custom utility to arrange the chapter for manuscript creation.

### Manscript

![](/blog/posts/notion-for-authors/image-8.png)



The Manuscript object serves the purpose of collecting together each chapter and defining what outputs will be created by my custom manuscript building. This object server more of a functional organizational role, rather than a strictly creative one.

### Draft Tracking

The final component in my notion approach to novel writing is the Draft Tracking object:

![](/blog/posts/notion-for-authors/image-9.png)



This database allows me to define multiple drafts, and to calculate what percentage of completion each draft is at by comparing the current word count is to a projected target word count.



And that is it for my use of Notion directly. In the future, I will write an article on my Notion Manuscript Builder application, and how I use it to export all of my novels scenes, and compile them into multiple target outputs.



Until then, take it easy!



