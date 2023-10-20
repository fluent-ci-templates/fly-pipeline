import { gql } from "../../deps.ts";

export const deploy = gql`
  query deploy($src: String!, $token: String!) {
    deploy(src: $src, token: $token)
  }
`;
