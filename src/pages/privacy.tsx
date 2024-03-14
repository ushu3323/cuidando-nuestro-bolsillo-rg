import { Container } from "@mui/material";
import { type LayoutProps } from "../components/layout/Layout";

export default function PrivacyPage() {
  return (
    <main>
      <Container maxWidth="md" className="mb-10">
        <h1 className="mb-2">Política de Privacidad</h1>

        <h2 className="mb-8 mt-0 text-base">
          Ultima actualización: 26/02/2024
        </h2>

        <p className="mb-10 text-justify">
          Esta Política de Privacidad describe cómo{" "}
          &quot;Precios Río Grande&quot; recopila, utiliza y comparte la
          información recopilada cuando los usuarios eligen iniciar sesión en
          nuestro sitio web &quot;Precios Río Grande&quot; utilizando sus
          cuentas de Google o Facebook. Al utilizar el inicio de sesión con
          Google o Facebook en &quot;Precios Río Grande&quot;, aceptas los
          términos de esta política.
        </p>

        <h3>Información Recopilada</h3>
        <p className=" text-justify">
          Cuando los usuarios optan por iniciar sesión en{" "}
          &quot;Precios Río Grande&quot; utilizando sus cuentas de Google o
          Facebook, &quot;Precios Río Grande&quot; puede recopilar la
          siguiente información:
        </p>
        <ul className="mb-12">
          <li>
            Información de perfil público proporcionada por Google o Facebook,
            que puede incluir nombre, foto de perfil, dirección de correo
            electrónico
          </li>
          <li>
            Identificador único de usuario proporcionado por Google o Facebook.
          </li>
          <li>
            Información de inicio de sesión, incluidos los registros de fecha y
            hora de inicio de sesión.
          </li>
        </ul>

        <h3>Uso de la Información</h3>
        <p className="text-justify">
          La información recopilada se utiliza para los siguientes propósitos:
        </p>
        <ul className="mb-12">
          <li>
            Facilitar el proceso de inicio de sesión y la autenticación de
            usuarios en &quot;Precios Río Grande&quot;.
          </li>
          <li>
            Personalizar la experiencia del usuario en{" "}
            &quot;Precios Río Grande&quot; según la información del perfil
            proporcionada por Google o Facebook.
          </li>
          <li>
            Comprender y analizar cómo los usuarios interactúan con{" "}
            &quot;Precios Río Grande&quot; para mejorar nuestros servicios
            y funcionalidades.
          </li>

          <li>
            Enviar comunicaciones relacionadas con la cuenta, como
            notificaciones de cambios en la configuración de la cuenta o
            actualizaciones de seguridad.
          </li>
        </ul>

        <h3>Compartir de la Información</h3>
        <p className="text-justify">
          &quot;Precios Río Grande&quot; no venderá, alquilará ni
          compartirá la información recopilada con terceros sin el
          consentimiento expreso del usuario, excepto en los siguientes casos:
        </p>
        <ul className="mb-12">
          <li>
            Cuando sea necesario para cumplir con las leyes y regulaciones
            aplicables.
          </li>
          <li>
            Cuando sea necesario para proteger los derechos, la propiedad o la
            seguridad de &quot;Precios Río Grande&quot; o de otros
            usuarios.
          </li>
        </ul>

        <h3>Seguridad de la Información</h3>
        <p className="mb-12 text-justify">
          &quot;Precios Río Grande&quot; toma medidas razonables para
          proteger la información recopilada contra accesos no autorizados,
          divulgación, alteración o destrucción. Sin embargo, ninguna
          transmisión de datos a través de Internet o almacenamiento electrónico
          puede garantizarse como 100% segura.
        </p>

        <h3>Cambios en la Política de Privacidad</h3>
        <p className="mb-12 text-justify">
          &quot;Precios Río Grande&quot; se reserva el derecho de
          actualizar esta Política de Privacidad en cualquier momento. Se
          notificará a los usuarios sobre cambios significativos mediante la
          publicación de una versión actualizada en{" "}
          &quot;Precios Río Grande&quot;.
        </p>

        <h3>Contacto</h3>
        <p className="mb-12 text-justify">
          Si tienes alguna pregunta o inquietud sobre esta Política de
          Privacidad, no dudes en contactarnos a través de{" "}
          <a href="mailto:magianpc@gmail.com">magianpc@gmail.com</a>
        </p>
      </Container>
    </main>
  );
}


PrivacyPage.layoutProps = {
  containerProps: {
    maxWidth: false,
    disableGutters: true,
  }
} satisfies LayoutProps