---
layout: default
---

<div class="home">

    <section class="intro">
        <div class="grid">
            <div class="unit whole center-on-mobiles">
                <p class="vision">{{ site.vision }}</p>
                <p class="description"> {{ site.description }}</p>
                <p class="details hide-on-mobiles"> {{ site.details }}</p>
            </div>
        </div>
    </section>
    <section class="feature">
        <div class="grid">
            <div class='unit one-third'>
                <h2>Images</h2>
                <p>
                    Tonic Data Manager let you download and cache images for
                    faster usage inside your Web content.
                </p>
            </div>
            <div class="unit one-third">
                <h2>Raw Binary</h2>
                <p>
                    Tonic Data Manager let you download binary file and access
                    their content without unnecessary conversion.
                </p>
            </div>
            <div class="unit one-third">
                <h2>Text/JSON</h2>
                <p>
                    Tonic Data Manager handle common data format. No need to
                    have yet another library for managing complex and simple
                    remote resources.
                </p>
            </div>
        </div>
    </section>
   <div class="grid">
        <div class="unit whole">
        <h2>Getting Started</h2>
        <p>{{ site.project }} can be retrieved using npm.</p>
        <h2>npm</h2>
{% highlight bash %}
~ $ npm install -g {{ site.project }}
{% endhighlight %}
            <h2>Quick-start</h2>
            For the impatient, here's how to get boilerplate {{ site.project }} up and running.
{% highlight bash %}
~ $ git clone git@github.com:{{site.repository}}.git
~ $ cd {{site.project}}
~/{{site.project}} $ npm install
~/{{site.project}} $ npm test
{% endhighlight %}
        <h2>Documentation</h2>
        <p>See the <a href="{{ site.baseurl }}">documentation</a> for a getting started guide, advanced documentation,
        and API descriptions.</p>
        <h2>Licensing</h2>
        <p>{{ site.title }} is licensed under {{ site.license }}
        <a href="https://github.com/{{ site.repository }}/blob/master/LICENSE">License</a>.</p>
        <h2>Getting Involved</h2>
        <p>Fork the {{ site.project }} repository and do great things. At <a href="{{ site.companyURL }}">
        {{ site.company }}</a>, we want to make {{ site.project }} useful to as many people as possible.
        </div>
    </div>
</div>
