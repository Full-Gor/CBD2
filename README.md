# Matrix Editor - Voice Commands

Matrix Editor supports voice commands for coding efficiency. Here are the available voice commands:

## Punctuation Commands

| Voice Command | Output | Description |
|---------------|--------|-------------|
| "comma" | `,` | Insert comma |
| "semicolon" | `;` | Insert semicolon |
| "question mark" | `?` | Insert question mark |
| "dot" / "period" | `.` | Insert period |
| "forward slash" | `/` | Insert forward slash |
| "backslash" | `\` | Insert backslash |
| "colon" | `:` | Insert colon |
| "double quote" | `"` | Insert double quote |
| "single quote" / "apostrophe" | `'` | Insert single quote |

## Bracket Commands

| Voice Command | Output | Description |
|---------------|--------|-------------|
| "open parenthesis" | `(` | Insert opening parenthesis |
| "close parenthesis" | `)` | Insert closing parenthesis |
| "open bracket" | `[` | Insert opening bracket |
| "close bracket" | `]` | Insert closing bracket |
| "open brace" | `{` | Insert opening brace |
| "close brace" | `}` | Insert closing brace |

## Operator Commands

| Voice Command | Output | Description |
|---------------|--------|-------------|
| "equals" | `=` | Insert equals sign |
| "plus" | `+` | Insert plus sign |
| "minus" | `-` | Insert minus sign |
| "multiply" / "asterisk" | `*` | Insert asterisk |
| "ampersand" | `&` | Insert ampersand |
| "less than" | `<` | Insert less than |
| "greater than" | `>` | Insert greater than |
| "exclamation" | `!` | Insert exclamation mark |
| "percent" | `%` | Insert percent sign |
| "underscore" | `_` | Insert underscore |
| "backtick" / "grave accent" | `` ` `` | Insert backtick |

## Programming Keywords

| Voice Command | Output | Description |
|---------------|--------|-------------|
| "function" | `function` | Insert function keyword |
| "const" | `const` | Insert const keyword |
| "let" | `let` | Insert let keyword |
| "var" | `var` | Insert var keyword |
| "if" | `if` | Insert if keyword |
| "else" | `else` | Insert else keyword |
| "for" | `for` | Insert for keyword |
| "while" | `while` | Insert while keyword |
| "return" | `return` | Insert return keyword |
| "class" | `class` | Insert class keyword |
| "import" | `import` | Insert import keyword |
| "export" | `export` | Insert export keyword |
| "from" | `from` | Insert from keyword |
| "default" | `default` | Insert default keyword |

## Action Commands

| Voice Command | Output | Description |
|---------------|--------|-------------|
| "new line" | `\n` | Insert new line |
| "tab" | `\t` | Insert tab |
| "space" | ` ` | Insert space |
| "backspace" | `BACKSPACE` | Delete previous character |
| "delete" | `DELETE` | Delete next character |
| "copy" | `COPY` | Copy selection |
| "paste" | `PASTE` | Paste clipboard |
| "select all" | `SELECT_ALL` | Select all text |
| "save" | `SAVE` | Save current file |

## Usage

1. **Activate Voice Commands**: Tap the microphone button in the custom keyboard or use the voice commands panel
2. **Speak Clearly**: Use the exact voice commands listed above
3. **Natural Speech**: You can also speak normal text, and it will be inserted as-is
4. **Combine Commands**: You can chain multiple voice commands together

## Tips

- Speak at a normal pace for best recognition
- Use voice commands in a quiet environment
- The voice recognition works best with clear pronunciation
- You can mix voice commands with regular typing

## Examples

### Creating a JavaScript function:
1. Say "function"
2. Say "space"
3. Say "myFunction"
4. Say "open parenthesis"
5. Say "close parenthesis"
6. Say "space"
7. Say "open brace"
8. Say "new line"
9. Say "return"
10. Say "space"
11. Say "true"
12. Say "semicolon"
13. Say "new line"
14. Say "close brace"

### Creating an HTML element:
1. Say "less than"
2. Say "div"
3. Say "space"
4. Say "class"
5. Say "equals"
6. Say "double quote"
7. Say "container"
8. Say "double quote"
9. Say "greater than"
10. Say "Hello World"
11. Say "less than"
12. Say "forward slash"
13. Say "div"
14. Say "greater than"

The Matrix Editor voice commands system is designed to speed up coding by allowing you to speak common programming symbols and keywords instead of typing them manually.

## Build APK avec EAS (Expo Application Services)

### Prérequis

1. **Installer EAS CLI** :
   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter à votre compte Expo** :
   ```bash
   eas login
   ```

3. **Configurer le projet** (si ce n'est pas déjà fait) :
   ```bash
   eas build:configure
   ```

### Configuration du build

Le fichier `eas.json` est déjà configuré avec trois profils :

- **development** : Pour générer un APK de développement
- **preview** : Pour générer un APK de prévisualisation
- **production** : Pour générer un App Bundle pour le Play Store

### Générer l'APK de développement

Pour créer un APK de développement, exécutez :

```bash
eas build --profile development --platform android
```

### Options supplémentaires

- **Build local** (nécessite Android Studio) :
  ```bash
  eas build --profile development --platform android --local
  ```

- **Télécharger l'APK** : 
  Une fois le build terminé, EAS fournira un lien de téléchargement. Vous pouvez aussi utiliser :
  ```bash
  eas build:list --platform android
  ```

### Configuration personnalisée

Si vous souhaitez modifier la configuration du build, éditez le fichier `eas.json` :

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    }
  }
}
```

### Installation de l'APK

1. Téléchargez l'APK depuis le lien fourni par EAS
2. Transférez-le sur votre appareil Android
3. Activez "Sources inconnues" dans les paramètres de sécurité
4. Installez l'APK en tapant dessus

### Résolution des problèmes courants

- **Erreur de signature** : Assurez-vous d'avoir configuré vos credentials avec `eas credentials`
- **Build échoué** : Vérifiez les logs sur le dashboard EAS
- **APK trop lourd** : Utilisez le profil "production" pour générer un App Bundle optimisé

Pour plus d'informations, consultez la [documentation officielle d'EAS Build](https://docs.expo.dev/build/introduction/).