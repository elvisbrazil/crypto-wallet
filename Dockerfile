# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN  npm install --force --legacy-peer-deps

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3015

# Comando para iniciar a aplicação
CMD ["npm", "start"]
