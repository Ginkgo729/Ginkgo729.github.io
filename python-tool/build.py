import os

import markdown
from bs4 import BeautifulSoup


def read_file(file_path):
    file = open(file_path, "r", encoding="utf-8")
    content = ""
    for item in file.readlines():
        content += item
    file.close()
    return content


def markdown_convert_html(text):
    return markdown.markdown(text)


def rebuild_html(soup, name, insert_html):
    div = soup.find(id=name)
    div .clear()
    div.append(BeautifulSoup(insert_html.replace("code", "pre"), "html.parser"))
    # print(div)


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


def build_home_page():
    template_page_path = "../template.html"
    template_soup = read_html(template_page_path)

    rebuild_intro(template_soup)
    rebuild_experience(template_soup)
    rebuild_other(template_soup)

    save(template_soup.prettify())


def create_menu_html(catalog, li_content):
    for key in catalog.keys():
        if len(catalog[key]) == 0:
            li_content.append('<li><a href="index.html">' + key[1:] + '</a></li>')
        else:
            li_content.append("<li>")
            li_content.append("<span class=\"opener\">" + key + "</span>")
            li_content.append("<ul>")
            create_menu_html(catalog[key], li_content)
            li_content.append("</ul>")
            li_content.append("</li>")


def create_menu(soup, file_list):
    catalog = {}
    for file in file_list:
        keys = file.split("\\")

        temp = catalog
        for index in range(6, len(keys)):
            if keys[index-1] not in temp:
                temp[keys[index - 1]] = {}
            temp = temp[keys[index - 1]]
            temp[keys[index]] = {}
    print(catalog)

    li_content = []
    create_menu_html(catalog, li_content)
    print(li_content)

    print("****************")
    content = ""
    for item in li_content:
        content += item + "\n"
    # print(content)

    html = BeautifulSoup(content, "html.parser")
    # print(html.prettify())

    ul_node = soup.find(id="menu").find("ul")
    ul_node.clear()
    ul_node.append(html)
    print(ul_node)


def create_article(blog_path, file_list, soup):
    # template_page_path = "../theme/html5up-editorial/article/article_template.html"
    # soup = read_html(template_page_path)

    root = "../theme/html5up-editorial/article/"
    for file in file_list:
        print(file)
        content = read_file(file)
        insert_html = markdown_convert_html(content)
        rebuild_html(soup, "article", insert_html)

        file_path = root + file.split("\\")[-1].replace("md", "html")
        print(file_path)
        save(soup.prettify(), file_path)


def get_catalog(blog_path):
    file_list = []
    for root, dirs, files in os.walk(blog_path, topdown=False):
        for file in files:
            if file[0] != "+":
                continue
            file_list.append(os.path.join(root, file))
    print(file_list)
    return file_list


def build_article_page(blog_path):
    # template_page_path = "../theme/html5up-editorial/template.html"
    template_page_path = "../theme/html5up-editorial/article/article_template.html"
    template_soup = read_html(template_page_path)

    file_list = get_catalog(blog_path)
    create_menu(template_soup, file_list)
    create_article(blog_path, file_list, template_soup)

    save(template_soup.prettify(), path="../theme/html5up-editorial/index.html")


if __name__ == '__main__':
    # build_home_page()
    build_article_page("F:\Code\Markdown\LOG\profession")
