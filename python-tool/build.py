import os

import markdown
from bs4 import BeautifulSoup


extensions = [ #根据不同教程加上的扩展
    'markdown.extensions.extra',
    'markdown.extensions.codehilite', #代码高亮扩展
    'markdown.extensions.toc',
    'markdown.extensions.tables',
    'markdown.extensions.fenced_code',
]

config = {
    'codehilite': {
        'use_pygments': False,
        'css_class': 'prettyprint linenums',
    }
}


def read_file(file_path):
    file = open(file_path, "r", encoding="utf-8")
    content = ""
    for item in file.readlines():
        content += item
    file.close()
    return content


def markdown_convert_html(text):
    return markdown.markdown(text, extensions=extensions, extension_config=config)


def rebuild_html(soup, name, insert_html):
    div = soup.find(id=name)
    div.clear()
    div.append(BeautifulSoup(insert_html, "html.parser"))


def save(content, path="..index.html"):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def read_html(path):
    return BeautifulSoup(read_file(path), "html.parser")


def rebuild_intro(soup):
    intro_path = "../article/intro.md"
    content = read_file(intro_path)
    insert_html = markdown_convert_html(content)
    rebuild_html(soup, "intro", insert_html)


def rebuild_experience(soup):
    path = "../article/experience.md"
    content = read_file(path)
    insert_html = markdown_convert_html(content)
    rebuild_html(soup, "experience", insert_html)


def rebuild_other(soup):
    path = "../article/other.md"
    content = read_file(path)
    insert_html = markdown_convert_html(content)
    rebuild_html(soup, "other", insert_html)


def write_catalog_markdown(catalog, content_list, space_amount):
    for key in catalog.keys():
        if len(catalog[key]) == 0:
            content_list.append(' ' * space_amount + '- [' + key[1:] + '](./article/article/' + str(key).replace("md", "html") + ')')
        else:
            content_list.append(' ' * space_amount + '- ' + key)
            write_catalog_markdown(catalog[key], content_list, space_amount + 4)


def _build_catalog(catalog, keys, index):
    if index == len(keys) - 1:
        catalog[keys[index]] = {}
    else:
        if keys[index] not in catalog:
            catalog[keys[index]] = {}
        _build_catalog(catalog[keys[index]], keys, index + 1)


def create_catalog_markdown(file_list):
    catalog = {}
    for file in file_list:
        keys = file.split("\\")
        _build_catalog(catalog, keys, 5)

    print("\n\n文章目录结构：")
    for key in catalog.keys():
        print(key, catalog[key])

    content_list = ["## 文章目录", "***"]
    for key in catalog.keys():
        content_list.append("## " + key)
        write_catalog_markdown(catalog[key], content_list, 0)

    contents = ""
    for item in content_list:
        contents += item + "\n"
    print(contents)
    return contents


def build_catalog(file_list, soup):
    catalog_markdown = create_catalog_markdown(file_list)
    save(catalog_markdown, "../article/catalog/catalog.md")
    insert_html = markdown_convert_html(catalog_markdown)

    article = soup.find(id="article")
    article.clear()
    article.append(BeautifulSoup(insert_html, "html.parser"))


def build_article(file_list):
    template_page_path = "../article_template.html"
    template_soup = read_html(template_page_path)
    for file in file_list:
        content = read_file(file)
        insert_html = markdown_convert_html(content)

        rebuild_html(template_soup, "article", insert_html)
        file_path = "../article/article/" + file.split("\\")[-1].replace("md", "html")
        save(template_soup.prettify(), file_path)


def build_resume(soup):
    markdown = read_file("../article/resume.md")
    context = markdown_convert_html(markdown)
    article = "<article id=\"resume\">\n"
    article += str(context)
    article += "\n</article>"

    main_div = soup.find(id="main")
    main_div.append(BeautifulSoup(article, "html.parser"))


def build_home_page():
    template_page_path = "../template.html"
    template_soup = read_html(template_page_path)

    rebuild_intro(template_soup)
    rebuild_experience(template_soup)
    rebuild_other(template_soup)
    build_resume(template_soup)

    blog_path = "F:\Code\Markdown\LOG\profession"
    file_list = get_catalog(blog_path)
    build_catalog(file_list, template_soup)

    save(template_soup.prettify(), "../index.html")

    build_article(file_list)


def get_catalog(blog_path):
    file_list = []
    for root, dirs, files in os.walk(blog_path, topdown=False):
        for file in files:
            if file[0] != "+":
                continue
            file_list.append(os.path.join(root, file))
            print("加载文章：" + os.path.join(root, file))
    print(len(file_list), file_list)
    return file_list


if __name__ == '__main__':
    build_home_page()
