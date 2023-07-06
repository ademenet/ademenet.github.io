---
author: "Alain Demenet"
title: "🇫🇷 Créer une AMI avec Packer"
slug: "creer-ami-packer-fr"
date: "2023-02-09"
---

[Packer](https://www.packer.io/) est un utilitaire créé par nos amis d'[Hashicorp](https://www.hashicorp.com/), les créateurs de [Terraform](https://www.terraform.io/), afin de créer des images serveur déployables vers n'importe quel cloud.

Ici, nous allons nous intéresser à comment créer une image EC2 (les serveurs d'AWS), c'est-à-dire une AMI sur AWS en créant une image Ubuntu avec Docker et Docker-compose pré-installé.

## Qu'est-ce qu'une AMI ?

AMI signifie Amazone Machine Images. Il s'agit d'une image de machine EC2 qui permet de lancer une instance rapidement. Les AMI sont très pratiques si vous avez besoin de reproduire une configuration à plusieurs reprises.

Vous pourriez tout à fait exécuter le même script d'initialisation à chaque nouvelle instance EC2. Ou bien, en utilisant une AMI vous gagnez en simplicité et en temps en ayant une machine déjà configuré selon vos besoins.

## C'est quoi Packer ?

Packer vous permet donc de créer aisément des images à l'aide de fichier de configuration. Cette approche sous forme de code est très pratique pour permettre de versionner ces images.

## Installation

> Je suis sous MacOS. Vous pouvez retrouver les [autres commandes ici](https://developer.hashicorp.com/packer/tutorials/aws-get-started/get-started-install-cli#installing-packer).

Installons Packer à l'aide de Brew :

```shell
brew install packer
```

Pour vérifier que l'installation s'est bien passée :

```shell
packer
```

Devrait vous sortir :

```shell
Usage: packer [--version] [--help] <command> [<args>]

Available commands are:
    build           build image(s) from template
    console         creates a console for testing variable interpolation
    fix             fixes templates from old versions of packer
    fmt             Rewrites HCL2 config files to canonical format
    hcl2_upgrade    transform a JSON template into an HCL2 configuration
    init            Install missing plugins or upgrade plugins
    inspect         see components of a template
    plugins         Interact with Packer plugins and catalog
    validate        check that a template is valid
    version         Prints the Packer version
```

## Création de l'image

Dans un nouveau dossier `packer`, créons un fichier `docker-ami.pkr.hcl`. Ouvrons le avec notre IDE favoris et commenc

## Déploiement

Nous allons maintenant voir comment créer notre AMI.

Tout d'abord il faut initialiser le répertoire :

```shell
packer init .
```

Cela permet à Packer d'installer les plug-ins que nous avons défini dans le bloc `packer`. Il faut relancer la commande si vous avez modifier ce dernier.

Un petit coup de formatage :

```shell
packer fmt .
```

Et nous validons le fichier :

```shell
packer validate .
```

Si Packer nous dit `The configuration is valid.`, nous pouvons lancer la création de l'image :

```shell
packer build docker-ami.pkr.hcl
```
